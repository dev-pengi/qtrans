import * as fs from "fs";
import kleur from "kleur";
import ora from "ora";
import path from "path";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import { delay } from "./utils/time.util";

import { minimatch } from "minimatch";

const getAllFiles = async (
  dir: string,
  ext: string[],
  files: string[] = [],
  ignore: string[] = []
): Promise<string[]> => {
  const entries = await fs.promises.readdir(dir);
  for (const file of entries) {
    const fullPath = path.join(dir, file);
    const relPath = path.relative(process.cwd(), fullPath);

    if (relPath.includes("node_modules")) continue;
    if (ignore.some((pattern) => minimatch(relPath, pattern))) continue;

    const stat = await fs.promises.stat(fullPath);
    if (stat.isDirectory()) {
      await getAllFiles(fullPath, ext, files, ignore);
    } else if (ext.some((e) => file.endsWith(e))) {
      files.push(fullPath);
    }
  }
  return files;
};

export const scanDir = async ({
  attributes = [],
  ignore = [],
  maxResults = 0, //if 0 show all results, if more than 0 show up to the number
}: {
  attributes: string[];
  ignore: string[];
  maxResults: number;
}) => {
  const currentDir = process.cwd();
  const configPath = path.resolve(currentDir, "package.json");
  const spinner = ora();
  const delayTime = 500;

  spinner.start("Checking for qtrans config...");
  await delay(delayTime);

  try {
    await fs.promises.access(configPath);
  } catch {
    spinner.fail("config file not found");
    console.error(
      kleur.red("Error: Make sure you are in a qtrans initiated workspace!")
    );
    process.exit(1);
  }

  spinner.start(`Collecting files data...`);

  let files = await getAllFiles(currentDir, [".jsx", ".tsx"], [], ignore);

  if (maxResults > 0 && maxResults < files.length) {
    files = files.slice(0, maxResults);
  }

  await delay(delayTime);

  spinner.text = `Scanning JSX files... (0/${files.length})`;

  const results: {
    file: string;
    line: number;
    column: number;
    text: string;
  }[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    spinner.text = `Scanning JSX files... (${i + 1}/${files.length})`;
    const code = await fs.promises.readFile(file, "utf8");

    const ast = parse(code, {
      sourceType: "module",
      plugins: ["jsx", "typescript", "decorators-legacy"],
    });

    const variableMap = new Map<string, string>();

    traverse(ast, {
      VariableDeclarator(path) {
        if (t.isIdentifier(path.node.id) && t.isStringLiteral(path.node.init)) {
          variableMap.set(path.node.id.name, path.node.init.value);
        }
      },
      // ImportDeclaration(_path) {
      //   console.log(path);
      // },
    });

    traverse(ast, {
      JSXElement(path) {
        const openingEl = path.node.openingElement;

        for (const child of path.node.children) {
          if (t.isJSXText(child)) {
            const raw = child.value.trim();
            if (raw) {
              results.push({
                file,
                line: child.loc?.start.line ?? 0,
                column: child.loc?.start.column ?? 0,
                text: raw,
              });
            }
          } else if (
            t.isJSXExpressionContainer(child) &&
            t.isIdentifier(child.expression)
          ) {
            const varName = child.expression.name;
            if (variableMap.has(varName)) {
              results.push({
                file,
                line: child.loc?.start.line ?? 0,
                column: child.loc?.start.column ?? 0,
                text: variableMap.get(varName)!,
              });
            }
          }
        }

        for (const attr of openingEl.attributes) {
          if (
            t.isJSXAttribute(attr) &&
            t.isJSXIdentifier(attr.name) &&
            attributes.includes(attr.name.name)
          ) {
            if (t.isStringLiteral(attr.value)) {
              results.push({
                file,
                line: attr.loc?.start.line ?? 0,
                column: attr.loc?.start.column ?? 0,
                text: attr.value.value,
              });
            } else if (
              t.isJSXExpressionContainer(attr.value) &&
              t.isIdentifier(attr.value.expression) &&
              variableMap.has(attr.value.expression.name)
            ) {
              results.push({
                file,
                line: attr.loc?.start.line ?? 0,
                column: attr.loc?.start.column ?? 0,
                text: variableMap.get(attr.value.expression.name)!,
              });
            }
          }
        }
      },
    });
  }

  spinner.succeed(
    `Scan completed. Found ${results.length} matches in ${files.length} files`
  );

  for (const r of results) {
    console.log(
      kleur.cyan(`${r.file}:${r.line}:${r.column}`) +
        " - " +
        kleur.yellow(`"${r.text}"`)
    );
  }
};
