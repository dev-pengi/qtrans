import kleur from "kleur";
import { Express } from "express";

export const initPort = (app: Express, host: string, port: number) => {
  try {
    app.listen(port, host, () => {
      console.log(kleur.green(`Server running on http://${host}:${port}`));
    });
  } catch (error) {
    console.log(
      kleur.red(
        `This port ${port} is already in use. Please try modifying the port in "qtrans.config.ts" file. or close the process running on this port.`
      )
    );
    process.exit(1);
  }
};
