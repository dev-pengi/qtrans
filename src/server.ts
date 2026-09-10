import dotenv from "dotenv";
import path from "path";
import express from "express";
import kleur from "kleur";
import translationsRouter from "./routes/translations";
import { errorHandler, notFound } from "./middlewares/error.middleware";
import {
  config,
  loadLanguagesConfig,
  rootDir,
  updateRootDir,
} from "./config";
import { initPort } from "./utils/port.util";
import settingsRouter from "./routes/settings";
import { checkConfigFile } from "./utils/validate.util";
import llmRouter from "./routes/llm";


dotenv.config();

interface ServerOptions {
  isDev: boolean;
  host?: string;
  port?: number;
}

export default async function startServer(options: ServerOptions) {
  const { isDev } = options;

  console.log(isDev);

  const host = process.env.QTRANS_HOST || options.host || "localhost";

  updateRootDir(
    isDev ? path.join(__dirname, `../${process.env.TEST_DIR}`) : process.cwd()
  );

  console.log(rootDir);

  if (!rootDir) return;
  checkConfigFile();


      try {
        loadLanguagesConfig();
      } catch (error) {
        console.log(
          kleur.red(
            "Error reading translation files. please make sure they are valid JSON files."
          )
        );
        console.log(kleur.red("Exiting the process."));
        process.exit(1);
      }

  const app = express();

  console.log(
    kleur.blue(
      `Starting HELLO the server on ${host}:${config.port} for ${config.name} project...`
    )
  );

  initPort(app, host, config.port);

  app.use(express.json());
  app.use("/api/translations", translationsRouter);
  app.use("/api/settings", settingsRouter);
  app.use("/api/llm" , llmRouter)
 

  app.get("/api", (_req, res) => {
    res.json({ message: "API is working lol" });
  });

  console.log(isDev);
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
  startServer({ isDev: true });
}
