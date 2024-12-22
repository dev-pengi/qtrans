import dotenv from "dotenv";
import path from "path";
import express from "express";
import * as fs from "fs";
import kleur from "kleur";
import translationsRouter from "./routes/translations";
import { errorHandler, notFound } from "./middlewares/error.middleware";
import {
  config,
  initLanguagesConfig,
  mutableLanguagesConfig,
  rootDir,
  updateRootDir,
} from "./config";
import { initPort } from "./utils/port.util";
import settingsRouter from "./routes/settings";
import { checkConfigFile } from "./utils/validate.util";

dotenv.config();

export default async function startServer(isDev: boolean = false) {
  updateRootDir(
    isDev ? path.join(__dirname, `../${process.env.TEST_DIR}`) : process.cwd()
  );

  if (!rootDir) return;
  checkConfigFile();

  const dirPath = path.join(rootDir, config.location);

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  if (fs.existsSync(path.join(dirPath, "langs.json"))) {
    let langsConfig = fs.readFileSync(
      path.join(dirPath, "langs.json"),
      "utf-8"
    );

    if (!langsConfig || !langsConfig.trim().length) {
      fs.writeFileSync(
        path.join(dirPath, "langs.json"),
        JSON.stringify(mutableLanguagesConfig, null, 2)
      );
      langsConfig = JSON.stringify(mutableLanguagesConfig, null, 2);

      console.log(
        kleur.yellow(
          "langs.json file is empty, creating a new one with empty langs config."
        )
      );
    }

    try {
      const parsedLangsConfig = JSON.parse(langsConfig);
      initLanguagesConfig(parsedLangsConfig);
    } catch (error) {
      console.log(
        kleur.red(
          "Error reading langs.json file. please make sure it is a valid JSON file."
        )
      );
      console.log(kleur.red("Exiting the process."));
      process.exit(1);
    }
  } else {
    fs.writeFileSync(
      path.join(dirPath, "langs.json"),
      JSON.stringify(mutableLanguagesConfig, null, 2)
    );

    console.log(
      kleur.yellow(
        "langs.json file not found, creating a new one with empty langs config."
      )
    );
  }

  const app = express();

  console.log(
    kleur.blue(
      `Starting the server on PORT ${config.port} for ${config.name} project...`
    )
  );
  initPort(app, config.port);

  app.use(express.json());
  app.use("/api/translations", translationsRouter);
  app.use("/api/settings", settingsRouter);

  app.get("/api", (_req, res) => {
    res.json({ message: "API is working lol" });
  });

  if (isDev) {
    const { createProxyMiddleware } = await import("http-proxy-middleware");
    app.use(
      "/",
      createProxyMiddleware({
        target: "http://localhost:5173",
        changeOrigin: true,
        ws: true,
      })
    );
  } else {
    const toolClientSource = path.join(__dirname, "./build/index.html");

    app.use(express.static(path.join(__dirname, "./build")));

    app.get("/", (_req, res) => {
      res.sendFile(toolClientSource);
    });
  }

  app.use(notFound);
  app.use(errorHandler);
}

if (process.env.NODE_ENV === "development") {
  startServer(true);
}
