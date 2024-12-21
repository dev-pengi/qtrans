import kleur from "kleur";
import { rootDir, updateConfig } from "../config";
import path from "path";
import * as fs from "fs";

export const checkConfigFile = () => {
  if (!rootDir) {
    console.log(kleur.red("root dir cannot be found"));
    process.exit(1);
  }

  const defaultConfig = {
    port: 6757,
    name: path.basename(rootDir),
    location: fs.existsSync(path.join(rootDir, "src")) ? "src/langs" : "langs",
  };

  if (fs.existsSync(path.join(rootDir, "qtrans.config.json"))) {
    try {
      let rawConfigFile = fs.readFileSync(
        path.join(rootDir, "qtrans.config.json"),
        "utf-8"
      );
      if (!rawConfigFile || !rawConfigFile.trim().length) {
        fs.writeFileSync(
          path.join(rootDir, "qtrans.config.json"),
          JSON.stringify(defaultConfig, null, 2)
        );
        console.log(
          kleur.yellow(
            "qtrans.config.json file is empty, creating a new one with default values."
          )
        );
      }
    } catch (error) {
      console.error(error);
      console.log(
        kleur.red(
          "Error reading qtrans.config.json file. please make sure it is a valid JSON file."
        )
      );
      console.log(kleur.red("Exiting the process."));
      process.exit(1);
    }
  } else {
    console.log(
      kleur.red("No qtrans.config.json found in the root directory.")
    );
    console.log(
      kleur.red(
        "Exiting the process. you can set up it automatically by running `npx qtrans init`"
      )
    );
    process.exit(1);
  }

  const applyDefaults = (obj: any, defaultValues: Record<string, any>): any => {
    for (const key in defaultValues) {
      if (!(key in obj)) {
        obj[key] = defaultValues[key];
      }
    }
    return obj;
  };

  const ensureDefaultsInConfig = () => {
    try {
      if (!rootDir) return;
      const configFilePath = path.join(rootDir, "qtrans.config.json");
      const configData = fs.readFileSync(configFilePath, { encoding: "utf-8" });
      let configFile = JSON.parse(configData);

      const newConfig = applyDefaults(configFile, defaultConfig);

      fs.writeFileSync(configFilePath, JSON.stringify(newConfig, null, 2), {
        encoding: "utf-8",
      });

      if (JSON.stringify(newConfig) !== JSON.stringify(configFile)) {
        console.log("Defaults applied and saved to config file.");
      }
      updateConfig(() => newConfig);
    } catch (error) {
      console.error("Error updating configuration file:", error);
    }
  };

  ensureDefaultsInConfig();
};
