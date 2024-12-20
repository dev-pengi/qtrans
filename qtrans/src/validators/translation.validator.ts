import Joi from "joi";

export const createTranslationSchema = (
  availableLanguages: string[],
  defaultLanguage: string
) => {
  return Joi.object({
    key: Joi.string().required(),
    translation: Joi.object()
      .pattern(
        Joi.string().valid(...availableLanguages),
        Joi.string().required()
      )
      .custom((value, helpers) => {
        const keys = Object.keys(value);
        if (!keys.includes(defaultLanguage)) {
          return helpers.message(
            `Translation must include the default language: ${defaultLanguage}` as any
          );
        }
        return value;
      })
      .required(),
  });
};

export const updateTranslationSchema = (
  availableLanguages: string[],
) => {
  return Joi.object({
    key: Joi.string().optional(),
    translation: Joi.object()
      .pattern(
        Joi.string().valid(...availableLanguages),
        Joi.string().optional()
      )
      .optional(),
  });
};