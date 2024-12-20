import kleur from "kleur";
import { Express } from "express";

export const initPort = (app: Express, port: number) => {
  try {
    app.listen(port, () => {
      console.log(kleur.green(`Server is running on http://localhost:${port}`));
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
