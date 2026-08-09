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
  renameTranslationKey,
} from "../config";
import { AI_PROMPTS } from "../constants/prompts";
import { createProvider } from "../providers/provider.factory";
import { validatePlaceholders } from "../validators/placeholder.validator";


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

export const renameTranslation = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { translationKey } = req.params;
    const { newKey } = req.body;

    if (!newKey) {
      res.status(400).json({ error: "newKey is required in the request body" });
      return;
    }

    const existing = getTranslationByKey(translationKey);
    if (!existing) {
      res.status(404).json({ error: "Translation not found" });
      return;
    }
    const collisionCheck = getTranslationByKey(newKey);
    if (collisionCheck) {
      res.status(400).json({ error: `The key "${newKey}" already exists.` });
      return;
    }

    renameTranslationKey(translationKey, newKey);

    res.json({
      message: "Key renamed successfully",
      oldKey: translationKey,
      newKey: newKey,
      values: existing,
    });
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

  if (!llmConfig || !llmConfig.active_provider) {
  res.status(400).send("Please configure llm_config and select a provider in the Qtrans config file");
  return;
}

const providerSettings = llmConfig.providers[llmConfig.active_provider];

   if (!providerSettings || !providerSettings.api_key) {
      res
        .status(400)
        .send(
          "Please Configure LLM config and api key in the Qtrans config file"
        );
      return;
    }


    if (!llmConfig.prompt_strategy)
      llmConfig.prompt_strategy = "negative_prompt";

    try {
      const provider = createProvider(llmConfig);

      const generatedResponse = await provider.generateContent(
        `${AI_PROMPTS[llmConfig.prompt_strategy]}HERE IS THE PROMPT:${JSON.stringify(prompt)}`
      );

      const cleanedResponse = generatedResponse.replace(
        /```[a-zA-Z0-9]*\n|\n```/g,
        ""
      );

      const jsonData = JSON.parse(cleanedResponse);
      const sourceTranslation = prompt.providedValues?.en

      if (sourceTranslation) {
       for (const [language, translation] of Object.entries(jsonData)) {
        if (typeof translation === "string" &&
      !validatePlaceholders(sourceTranslation, translation)
    ) {
      throw new Error(
        `Placeholder mismatch in "${language}" translation`
      );
    }
  }
}

      res.status(200).send(jsonData);
    } catch (error: any) {
      console.error("Translation generation failed:", error);
      const message = error instanceof Error ? error.message : String(error);
      res.status(500).json({ error: message });
    }
  }
);
