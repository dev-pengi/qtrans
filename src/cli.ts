#!/usr/bin/env node

import { Command } from "commander";
import init from "./init";
import startServer from "./server";

const program = new Command();

program
  .command("init")
  .description("Initialize qareeb translator")
  .action(init);

program
  .command("run")
  .description("Run the translation manager server")
  .option("--host <host>", "Host to bind to", "localhost")
  .option("--port <port>", "Port to listen on", "6757")
  .action((options) => {
    startServer({
      isDev: false,
      host: options.host,
      port: parseInt(options.port, 10),
    });
  });

program.parse(process.argv);
