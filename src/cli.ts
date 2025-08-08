#!/usr/bin/env node

import { Command } from "commander";
import init from "./init";
import startServer from "./server";
import { scanDir } from "./scan";

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
  .action((opts) => {
    startServer({
      isDev: false,
      host: opts.host,
      port: parseInt(opts.port, 10),
    });
  });

program
  .command("scan")
  .description("scans the jsx code for raw text from the jsx files")
  .option(
    "--attr <attribute-names...>",
    "Select what component attributes to be affected"
  )
  .option(
    "--ignore <patterns...>",
    "Select what component attributes to be affected"
  )
  .action((opts) => {
    scanDir({ attributes: opts.attr, ignore: opts.patterns });
  });

program.parse(process.argv);
