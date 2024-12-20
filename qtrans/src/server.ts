import dotenv from "dotenv";
import path from "path";
import express from "express";
import * as fs from "fs";
import kleur from "kleur";
import { initPort } from "./utils/port.init.util";
import translationsRouter from "./routes/translations";
import swaggerUi from "swagger-ui-express";
import { errorHandler, notFound } from "./middlewares/error.middleware";
import yaml from "yaml";
import { initLanguagesConfig, mutableLanguagesConfig } from "./config";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();

const isDev = process.env.NODE_ENV === "dev";

const rootDir = isDev
  ? path.join(__dirname, "../test")
  : process.env.QTRANS_ROOT_DIR;

console.log(rootDir);

let configFile = {};

let config: {
  name?: string;
  location?: string;
  port?: number;
} = {};

async function startServer() {
  if (rootDir && fs.existsSync(path.join(rootDir, "qtrans.config.json"))) {
    try {
      let rawConfigFile = fs.readFileSync(
        path.join(rootDir, "qtrans.config.json"),
        "utf-8"
      );
      if (!rawConfigFile || !rawConfigFile.trim().length) {
        fs.writeFileSync(
          path.join(rootDir, "qtrans.config.json"),
          JSON.stringify({}, null, 2)
        );
        console.log(
          kleur.yellow(
            "qtrans.config.json file is empty, creating a new one with default values."
          )
        );

        rawConfigFile = "{}";
      }

      configFile = JSON.parse(rawConfigFile);
      config = JSON.parse(rawConfigFile);
    } catch (error) {
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

  if (!config.port) {
    config.port = 6757;
  }
  if (!config.name) {
    config.name = path.basename(rootDir);
  }
  if (!config.location) {
    if (fs.existsSync(path.join(rootDir, "src"))) {
      config.location = "src/langs";
    } else {
      config.location = "langs";
    }
  }

  if (JSON.stringify(configFile) !== JSON.stringify(config)) {
    fs.writeFileSync(
      path.join(rootDir, "qtrans.config.json"),
      JSON.stringify(config, null, 2)
    );
    console.log(
      kleur.yellow(
        "qtrans.config.json file is missing some key properties, adding them with default values."
      )
    );
  }

  //check if langs.json exists and create it if it doesn't

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
  //check if the port is already in use and if it is, try again by incrementing the port number over and over

  console.log(
    kleur.blue(
      `Starting the server on PORT ${config.port} for ${config.name} project...`
    )
  );
  initPort(app, config.port);

  if (isDev) {
    app.use(
      "/",
      createProxyMiddleware({
        target: "http://localhost:5173",
        changeOrigin: true,
        ws: true,
      })
    );
  } else {
    const toolClientSource = path.join(__dirname, "../client/build/index.html");

    app.use(express.static(path.join(__dirname, "../client/build")));

    app.get("/", (_req, res) => {
      res.sendFile(toolClientSource);
    });
  }
  app.use(express.json());

  app.use(express.json());
  app.use("/api/translations", translationsRouter);

  if (isDev) {
    const swaggerSpec = yaml.parse(
      fs.readFileSync("./src/api/swagger.yaml", "utf8")
    );
    app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

  app.get("/config", (_req, res) => {
    res.json(config);
  });

  app.get("/api", (_req, res) => {
    res.json({ message: "API is working lol" });
  });
  app.use(notFound);
  app.use(errorHandler);
}

startServer();
