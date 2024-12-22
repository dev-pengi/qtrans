import dotenv from "dotenv";
import path from "path";
import * as fs from "fs";
import kleur from "kleur";
import { Config } from "../types";

export let rootDir: string | undefined = undefined;
export let updateRootDir = (dir: string) => {
  rootDir = dir;
};

export type TranslationSchema = {
  languages: string[];
  defaultLanguage: string;
  translations: {
    [key: string]: {
      [key: string]: string;
    };
  };
};

export let config: Config = {
  port: 6757,
  location: "langs",
  name: "qtrans",
};

const replaceSecrets = (obj: any): any => {
  if (!rootDir) return obj;
  const envFilePath = path.join(rootDir, ".env");
  const checkEnvFile = fs.existsSync(envFilePath);

  if (!checkEnvFile) {
    console.log(
      kleur.bgRed(
        ".env file was not found, the secrets in the config will not be mapped"
      )
    );
    return obj;
  }
  const envConfig = dotenv.parse(
    fs.readFileSync(envFilePath, { encoding: "utf-8" })
  );

  if (typeof obj === "string") {
    const match = obj.match(/^ENV\.{{(.+?)}}$/);
    if (match) {
      const secretName = match[1];
      return envConfig[secretName] || obj;
    }
    return obj;
  } else if (Array.isArray(obj)) {
    return obj.map(replaceSecrets);
  } else if (typeof obj === "object" && obj !== null) {
    const newObj: any = {};
    for (const key in obj) {
      newObj[key] = replaceSecrets(obj[key]);
    }
    return newObj;
  }
  return obj;
};

export let updateConfig = (
  callback: (prev: typeof config) => void | typeof config
) => {
  let newConfig = callback(config) || config;
  newConfig = replaceSecrets(newConfig);
  config = newConfig;
};

export let mutableLanguagesConfig: TranslationSchema = {
  languages: ["en"],
  defaultLanguage: "en",
  translations: {},
};

export const generateTypes = () => {
  const typeDefs = `
// THIS FILE IS AUTO GENERATED, DO NOT MODIFY MANUALLY.

export type Language = ${
    mutableLanguagesConfig.languages.length > 0
      ? mutableLanguagesConfig.languages.map((lang) => `"${lang}"`).join(" | ")
      : "string"
  };

export type DefaultLanguage = "${
    mutableLanguagesConfig.defaultLanguage || "string"
  }";

export type TranslationKey = ${
    Object.keys(mutableLanguagesConfig.translations).length > 0
      ? Object.keys(mutableLanguagesConfig.translations)
          .map((key) => `"${key}"`)
          .join(" | ")
      : "string"
  };

export type Translations = Record<TranslationKey, Record<Language, string>>;

export interface TranslationFileSchema {
  languages: Language[];
  defaultLanguage: Language;
  translations: Translations;
}
`;

  if (!rootDir) return;
  const dirPath = path.join(rootDir, config.location);
  const typesDir = path.join(dirPath, "types");
  if (config.typeSafe) {
    if (!fs.existsSync(typesDir)) {
      fs.mkdirSync(typesDir);
    }
    fs.writeFileSync(path.join(typesDir, "index.d.ts"), typeDefs.trim());
  } else {
    if (fs.existsSync(path.join(typesDir, "index.d.ts"))) {
      fs.unlinkSync(path.join(typesDir, "index.d.ts"));
    }
  }
};

export let updateMutableLanguagesConfig = (
  callback: (
    prev: typeof mutableLanguagesConfig
  ) => void | typeof mutableLanguagesConfig
) => {
  mutableLanguagesConfig =
    callback(mutableLanguagesConfig) || mutableLanguagesConfig;

  if (rootDir && config.location) {
    const dirPath = path.join(rootDir, config.location);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFileSync(
      path.join(dirPath, "langs.json"),
      JSON.stringify(mutableLanguagesConfig, null, 2)
    );
  }

  generateTypes();
};

export const initLanguagesConfig = (config: any) => {
  mutableLanguagesConfig = config;
  generateTypes();
};

export const getLanguagesConfig = () => {
  return mutableLanguagesConfig;
};

export const getAllTranslations = () => {
  return mutableLanguagesConfig.translations;
};

export const getTranslationByKey = (key: string) => {
  return mutableLanguagesConfig.translations[key];
};

export const getLanguages = () => {
  return mutableLanguagesConfig.languages;
};

export const getDefaultLanguage = () => {
  return mutableLanguagesConfig.defaultLanguage;
};

export const addTranslation = (
  key: string,
  value: { [key: string]: string }
): { key: string; value: { [key: string]: string } } => {
  const { translations } = mutableLanguagesConfig;
  const newTranslations = {
    ...translations,
    [key]: value,
  };

  updateMutableLanguagesConfig((prev) => ({
    ...prev,
    translations: newTranslations,
  }));

  return { key, value: newTranslations[key] };
};

export const modifyTranslation = (
  key: string,
  value: { [key: string]: string }
): { key: string; value: { [key: string]: string } } => {
  const { translations } = mutableLanguagesConfig;
  const existingTranslation = translations[key] || {};
  const updatedTranslation = {
    ...existingTranslation,
    ...value,
  };

  updateMutableLanguagesConfig((prev) => ({
    ...prev,
    translations: {
      ...translations,
      [key]: updatedTranslation,
    },
  }));

  return { key, value: updatedTranslation };
};

export const removeTranslation = (key: string) => {
  const { translations } = mutableLanguagesConfig;
  updateMutableLanguagesConfig((prev) => {
    const newTranslations = { ...translations };
    delete newTranslations[key];
    return {
      ...prev,
      translations: newTranslations,
    };
  });
};

export const removeLanguage = (language: string) => {
  const { translations, languages } = mutableLanguagesConfig;
  updateMutableLanguagesConfig((prev) => {
    const newTranslations = { ...translations };
    delete newTranslations[language];
    return {
      ...prev,
      translations: newTranslations,
      languages: languages.filter((lang) => lang !== language),
    };
  });
};

export const addLanguage = (language: string) => {
  const { translations, languages } = mutableLanguagesConfig;
  updateMutableLanguagesConfig((prev) => ({
    ...prev,
    translations: {
      ...translations,
      [language]: {},
    },
    languages: [...languages, language],
  }));
};

export const setDefaultLanguage = (language: string) => {
  if (mutableLanguagesConfig.languages.includes(language)) {
    updateMutableLanguagesConfig((prev) => ({
      ...prev,
      defaultLanguage: language,
    }));
  }
};

export const setLanguages = ({
  languages,
  defaultLanguage,
}: {
  languages: string[];
  defaultLanguage: string;
}) => {
  updateMutableLanguagesConfig((prev) => ({
    ...prev,
    languages,
    defaultLanguage,
  }));
};
