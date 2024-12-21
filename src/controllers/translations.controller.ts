import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import {
  createTranslationSchema,
  updateTranslationSchema,
} from "../validators/translation.validator";
import {
  getAllTranslations,
  addTranslation,
  getLanguages,
  getTranslationByKey,
  removeTranslation,
  modifyTranslation,
  config,
} from "../config";
import { AI_PROMPT } from "../constants/prompts";

export const fetchAllTranslations = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const translations = getAllTranslations();
    res.json(
      Object.entries(translations).map(([key, value]) => ({
        key,
        value: value,
      }))
    );
  }
);

export const getTranslation = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const translation = getTranslationByKey(req.params.translationKey);
    if (!translation) {
      res.status(404).json({ error: "Translation not found" });
      return;
    }

    res.json({
      key: req.params.translationKey,
      value: translation,
    });
  }
);

export const createTranslation = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const validLanguages = getLanguages();
    const defaultLanguage = validLanguages[0];

    const schema = createTranslationSchema(validLanguages, defaultLanguage);

    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const translation = getTranslationByKey(req.body.key);

    if (translation) {
      res.status(400).json({ error: "Translation already exists" });
      return;
    }

    const newTranslation = addTranslation(req.body.key, req.body.translation);
    res.json(newTranslation);
  }
);

export const updateTranslation = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const validLanguages = getLanguages();

    const translation = getTranslationByKey(req.params.translationKey);
    if (!translation) {
      res.status(404).json({ error: "Translation not found" });
      return;
    }

    const schema = updateTranslationSchema(validLanguages);

    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const newTranslation = modifyTranslation(
      req.params.translationKey,
      req.body.translation
    );
    res.json(newTranslation);
  }
);

export const deleteTranslation = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const translation = getTranslationByKey(req.params.translationKey);
    if (!translation) {
      res.status(404).json({ error: "Translation not found" });
      return;
    }

    removeTranslation(req.params.translationKey);
    res.json({ message: "Translation deleted" });
  }
);

export const generateTranslations = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const prompt = req.body;

    if (!prompt) {
      throw new Error("prompt is required");
    }

    const llmConfig = config.llm_config;

    if (!llmConfig || !llmConfig.api_key) {
      res
        .status(400)
        .send(
          "Please Configure LLM config and api key in the Qtrans config file"
        );
      return;
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${llmConfig.api_key}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${AI_PROMPT} HERE IS THE PROMPT:\n\n\n${JSON.stringify(
                      prompt
                    )}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      if (data.error || !data.candidates || !data.candidates[0]) {
        throw new Error(`Couldn't generate translations ${data.error}`);
      }
      const jsonData = JSON.parse(data.candidates[0].content.parts[0].text);

      res.status(200).send(jsonData);
    } catch (error: any) {
      console.error(error);
      throw new Error(error);
    }
  }
);
