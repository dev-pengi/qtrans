import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { createTranslationSchema } from "../validators/translation.validator";
import {
  getAllTranslations,
  addTranslation,
  getLanguages,
  getTranslationByKey,
  removeTranslation,
} from "../config";

export const fetchAllTranslations = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const translations = getAllTranslations();
    res.json(
      Object.entries(translations).map(([key, value]) => ({
        key,
        translations: value,
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
      translations: translation,
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

    addTranslation(req.body.key, req.body.translation);
    res.json({ message: "Translation created" });
  }
);

export const updateTranslation = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const validLanguages = getLanguages();
    const defaultLanguage = validLanguages[0];

    const schema = createTranslationSchema(validLanguages, defaultLanguage);

    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    addTranslation(req.body.key, req.body.translation);
    res.json({ message: "Translation updated" });
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
