import { TranslationSchema } from "../config";
import { FilePartition } from "./types";

export const partitionSingle = (schema: TranslationSchema): FilePartition => ({
  "langs.json": schema,
});

export const partitionSeparate = (schema: TranslationSchema): FilePartition => {
  const files: FilePartition = {
    "langs.json": {
      languages: schema.languages,
      defaultLanguage: schema.defaultLanguage,
    },
  };

  for (const lang of schema.languages) {
    const langFile: Record<string, string> = {};
    for (const [key, values] of Object.entries(schema.translations)) {
      if (values[lang] !== undefined) langFile[key] = values[lang];
    }
    files[`${lang}.json`] = langFile;
  }

  return files;
};