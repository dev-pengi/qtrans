import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import {
  getLanguages,
  getDefaultLanguage,
  config,
  setLanguages,
} from "../config";
import { languagesValidator } from "../validators/settings.validator";

export const fetchConfig = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    res.json({
      name: config.name,
      port: config.port,
      languages: getLanguages(),
      defaultLanguage: getDefaultLanguage(),
    });
  }
);

export const configureLanguages = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const validation = languagesValidator.validate(req.body);

    console.log("hello 111");

    if (validation.error) {
      throw new Error(validation.error.message);
    }

    console.log("hello 222");
    setLanguages(req.body);
    console.log("hello 333");
    res.status(200).send(null);
  }
);
