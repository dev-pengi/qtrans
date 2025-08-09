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
  maxResults = 0,
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

  await delay(delayTime);

  spinner.text = `Scanning JSX files... (0/${files.length})`;

  const results: {
    file: string;
    line: number;
    column: number;
    text: string;
  }[] = [];

  for (let i = 0; i < files.length; i++) {
    try {
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
          if (
            t.isIdentifier(path.node.id) &&
            t.isStringLiteral(path.node.init)
          ) {
            variableMap.set(path.node.id.name, path.node.init.value);
          }
        },
      });

      traverse(ast, {
        JSXElement(path) {
          const openingEl = path.node.openingElement;

          const addResult = (line: number, col: number, text: string) => {
            results.push({ file, line, column: col, text });
            if (maxResults > 0 && results.length >= maxResults) {
              throw new Error("STOP");
            }
          };

          for (const child of path.node.children) {
            if (t.isJSXText(child)) {
              const raw = child.value.trim();
              if (raw)
                addResult(
                  child.loc?.start.line ?? 0,
                  child.loc?.start.column ?? 0,
                  raw
                );
            } else if (
              t.isJSXExpressionContainer(child) &&
              t.isIdentifier(child.expression)
            ) {
              const varName = child.expression.name;
              if (variableMap.has(varName)) {
                addResult(
                  child.loc?.start.line ?? 0,
                  child.loc?.start.column ?? 0,
                  variableMap.get(varName)!
                );
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
                addResult(
                  attr.loc?.start.line ?? 0,
                  attr.loc?.start.column ?? 0,
                  attr.value.value
                );
              } else if (
                t.isJSXExpressionContainer(attr.value) &&
                t.isIdentifier(attr.value.expression) &&
                variableMap.has(attr.value.expression.name)
              ) {
                addResult(
                  attr.loc?.start.line ?? 0,
                  attr.loc?.start.column ?? 0,
                  variableMap.get(attr.value.expression.name)!
                );
              }
            }
          }
        },
      });
    } catch (err) {
      if (!(err instanceof Error)) return;

      if (err.message === "STOP") break;
      
      throw err;
    }
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
