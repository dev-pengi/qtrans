import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { createTranslationSchema, updateTranslationSchema } from "../validators/translation.validator";
import {
  getAllTranslations,
  addTranslation,
  getLanguages,
  getTranslationByKey,
  removeTranslation,
  modifyTranslation,
} from "../config";

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
