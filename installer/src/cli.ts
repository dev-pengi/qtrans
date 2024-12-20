#!/usr/bin/env node

import { Command } from "commander";
import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import ora from "ora";

// utility function for delays
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// dynamically import chalk
async function getChalk() {
  const chalk = await import("chalk");
  return chalk.default;
}

function ensureDirectoryExists(dirPath: string) {
  const basePath = process.cwd(); // Get the current working directory
  const fullPath = path.resolve(basePath, dirPath); // Resolve the full path relative to the current directory
  const parts = path.relative(basePath, fullPath).split(path.sep); // Get only the relative parts
  let currentPath = basePath; // Start from the base path

  parts.forEach((part, index) => {
    currentPath = path.join(currentPath, part); // Construct the path incrementally

    if (fs.existsSync(currentPath)) {
      if (index === parts.length - 1) {
        // If it's the final directory and exists, throw an error
        throw new Error(
          `The final directory already exists: ${currentPath}. Cannot proceed.`
        );
      }
    } else {
      // Create the directory if it doesn't exist
      fs.mkdirSync(currentPath);
    }
  });
}

const program = new Command();

program
  .command("init")
  .description("Initialize qareeb translator")
  .action(async () => {
    const chalk = await getChalk();

    console.log(chalk.blue("Initializing translation setup..."));

    const spinner = ora();
    const delayTime = 1000;
    const currentDir = process.cwd();
    const packageJsonPath = path.resolve(currentDir, "package.json");

    // check if package.json exists
    spinner.start("Checking for package.json...");
    await delay(delayTime);
    if (!fs.existsSync(packageJsonPath)) {
      spinner.fail("package.json not found");
      console.error(
        chalk.red("Error: Make sure you are in the root directory.")
      );
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
        type: "list",
        name: "language",
        message:
          "Which language do you want to use for the translation manager?",
        choices: ["Typescript", "Javascript"],
        default: "Typescript",
      },
    ]);

    console.log("\nYou have selected the following options:");
    console.log(chalk.yellow(`Setup Directory: `), answers.setup_directory);
    console.log(chalk.yellow(`Project Name: `), answers.project_name);
    console.log(chalk.yellow(`Language: `), answers.language);

    const confirm = await inquirer.prompt([
      {
        type: "confirm",
        name: "proceed",
        message: "Do you want to continue with this setup?",
        default: true,
      },
    ]);

    if (!confirm.proceed) {
      console.log(chalk.red("\n\nSetup canceled. Exiting."));
      return;
    }

    // Ensure directory creation
    const setupDirectory = path.resolve(currentDir, answers.setup_directory);
    try {
      ensureDirectoryExists(setupDirectory);
      console.log(chalk.green(`Directory created: ${setupDirectory}`));
    } catch (error: any) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }

    const languagesTypes: any = { Typescript: ".ts", Javascript: ".js" };

    // create config file
    const configFileName = `config${languagesTypes[answers.language]}`;
    if (answers.language === "Typescript") {
      fs.writeFileSync(
        path.join(configFileName),
        `export const config = { name: '${answers.project_name}' };`
      );
    } else {
      fs.writeFileSync(
        path.join(configFileName),
        `module.exports = { name: '${answers.project_name}' };`
      );
    }
    console.log(
      chalk.green(`Config file created: ${path.join(configFileName)}`)
    );

    console.log(chalk.green("Translation setup complete."));
  });

program.parse(process.argv);
