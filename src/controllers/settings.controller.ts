import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import {
  getLanguages,
  getDefaultLanguage,
  config,
  setLanguages,
  setLLMProvider,
} from "../config";
import { languagesValidator, llmValidator } from "../validators/settings.validator";

export const fetchConfig = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    res.json({
      ...config,
      languages: getLanguages(),
      defaultLanguage: getDefaultLanguage(),
    });
  }
);

export const configureLanguages = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const validation = languagesValidator.validate(req.body);

    if (validation.error) {
      throw new Error(validation.error.message);
    }

    setLanguages(req.body);
    res.status(200).send(null);
  }
);

export const configureLLM = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    console.log(req.body);

    const validation = llmValidator.validate(req.body);

    if (validation.error) {
      throw new Error(validation.error.message);
    }

    const { active_provider } = req.body;

    setLLMProvider(active_provider);

    res.sendStatus(200);
  }
);
