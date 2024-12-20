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
  .action(() => startServer(false));

program.parse(process.argv);
