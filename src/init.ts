import kleur from "kleur";
import ora from "ora";
import path from "path";
import * as fs from "fs";

import { delay } from "./utils/time.util";
import inquirer from "inquirer";

function ensureDirectoryExists(dirPath: string) {
  const basePath = process.cwd();
  const fullPath = path.resolve(basePath, dirPath);
  const parts = path.relative(basePath, fullPath).split(path.sep);
  let currentPath = basePath;

  parts.forEach((part) => {
    currentPath = path.join(currentPath, part);

    if (!fs.existsSync(currentPath)) {
      fs.mkdirSync(currentPath);
    }
  });
}

export default async function init() {
  console.log(kleur.blue("Initializing translation setup..."));

  const spinner = ora();
  const delayTime = 1000;
  const currentDir = process.cwd();
  const packageJsonPath = path.resolve(currentDir, "package.json");

  // check if package.json exists
  spinner.start("Checking for package.json...");
  await delay(delayTime);
  if (!fs.existsSync(packageJsonPath)) {
    spinner.fail("package.json not found");
    console.error(kleur.red("Error: Make sure you are in the root directory."));
    process.exit(1);
  } else {
    spinner.succeed("Found package.json");
  }

  let srcFileExists = false;

  spinner.start("Getting the best directory for the setup files...");
  await delay(delayTime);
  const srcPath = path.resolve(currentDir, "src");
  if (!fs.existsSync(srcPath)) {
    srcFileExists = false;
  } else {
    srcFileExists = true;
  }
  spinner.stop();

  const parentDirectoryName = path.basename(path.dirname(currentDir));
  const defaultLocation = srcFileExists ? "src/langs" : "langs";

  // prompt user for configuration
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "setup_directory",
      message: "Where do you want the translation files to be created?: ",
      default: defaultLocation,
    },
    {
      type: "input",
      name: "project_name",
      message:
        "Enter your project name, Press Enter to use the directory name: ",
      default: parentDirectoryName,
    },
    {
      type: "confirm",
      name: "typeSafe",
      message:
        "Do you want the dictionary to be type safe? ( automatically generate and export types)",
      default: false,
    },
  ]);

  console.log("\nYou have selected the following options:");
  console.log(kleur.yellow(`Setup Directory: `), answers.setup_directory);
  console.log(kleur.yellow(`Project Name: `), answers.project_name);
  console.log(kleur.yellow(`Type Safe: `), answers.typeSafe ? "Yes" : "No");

  const confirm = await inquirer.prompt([
    {
      type: "confirm",
      name: "proceed",
      message: "Do you want to continue with this setup?",
      default: true,
    },
  ]);

  if (!confirm.proceed) {
    console.log(kleur.red("\n\nSetup canceled. Exiting."));
    return;
  }

  // Ensure directory creation
  const setupDirectory = path.resolve(currentDir, answers.setup_directory);
  try {
    ensureDirectoryExists(setupDirectory);
    const TranslationsFileName = `langs.json`;
    const defaultLangsConfig = {
      languages: ["en"],
      defaultLanguage: "en",
      translations: {},
    };

    fs.writeFileSync(
      path.join(setupDirectory, TranslationsFileName),
      JSON.stringify(defaultLangsConfig, null, 2)
    );
    console.log(kleur.green(`Directory created: ${setupDirectory}`));
  } catch (error: any) {
    console.error(kleur.red(`Error: ${error.message}`));
    process.exit(1);
  }

  // create config file

  const configFileName = "qtrans.config.json";
  const configFilePath = path.resolve(currentDir, configFileName);
  const config = {
    name: answers.project_name,
    location: answers.setup_directory,
    port: 6757,
    typeSafe: answers.typeSafe,
  };

  fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));

  console.log(kleur.green(`Config file created: ${path.join(configFileName)}`));

  console.log(kleur.green("Translation setup complete."));
}
