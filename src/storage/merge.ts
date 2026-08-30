import path from "path";
import { TranslationSchema } from "../config";
import { readJsonFile } from "./io";

export const mergeSingle = (dirPath: string): TranslationSchema =>
  readJsonFile(path.join(dirPath, "langs.json"), {
    languages: ["en"],
    defaultLanguage: "en",
    translations: {},
  });

export const mergeSeparate = (dirPath: string): TranslationSchema => {
  const meta = readJsonFile(path.join(dirPath, "langs.json"), {
    languages: ["en"],
    defaultLanguage: "en",
  });

  const translations: TranslationSchema["translations"] = {};

  for (const lang of meta.languages) {
    const langData = readJsonFile<Record<string, string>>(
      path.join(dirPath, `${lang}.json`),
      {}
    );
    for (const [key, value] of Object.entries(langData)) {
      translations[key] ??= {};
      translations[key][lang] = value;
    }
  }

  return { languages: meta.languages, defaultLanguage: meta.defaultLanguage, translations };
};