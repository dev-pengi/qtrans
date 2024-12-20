import kleur from "kleur";
import { Express } from "express";

export const initPort = (app: Express, port: number) => {
  let portWorking = false;
  let failAttempts = 0;

  while (!portWorking && failAttempts < 25) {
    failAttempts++;
    try {
      app.listen(port, () => {
        console.log(
          kleur.green(`Server is running on http://localhost:${port}`)
        );
      });
      portWorking = true;
    } catch (error) {
      console.log(
        kleur.red(
          `(${failAttempts}) - Port ${port} is already in use. Trying port ${
            port + 1
          }`
        )
      );
      port++;
    }
  }

  if (!portWorking) {
    console.log(
      kleur.red(
        `Could not find a free port to run the server after 25 attempts, please try to modify the port in qtrans.config.json file, or just be a bnadm and free up some ports.`
      )
    );
    process.exit(1);
  }
};
