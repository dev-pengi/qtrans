export type TranslationSchema = {
  languages: string[];
  defaultLanguage: string;
  translations: {
    [key: string]: {
      [key: string]: string;
    };
  };
};

export let mutableLanguagesConfig: TranslationSchema = {
  languages: ["en"],
  defaultLanguage: "en",
  translations: {},
};

export const initLanguagesConfig = (config: any) => {
  mutableLanguagesConfig = config;
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

export const addTranslation = (
  key: string,
  translation: { [key: string]: string }
) => {
  const { translations } = mutableLanguagesConfig;
  mutableLanguagesConfig = {
    ...mutableLanguagesConfig,
    translations: {
      ...translations,
      [key]: translation,
    },
  };
};

export const removeTranslation = (key: string) => {
  const { translations } = mutableLanguagesConfig;
  delete translations[key];
  mutableLanguagesConfig = {
    ...mutableLanguagesConfig,
    translations,
  };
};

export const updateTranslation = (
  key: string,
  translation: { [key: string]: string }
) => {
  const { translations } = mutableLanguagesConfig;
  const existingTranslation = translations[key] || {};

  mutableLanguagesConfig = {
    ...mutableLanguagesConfig,
    translations: {
      ...translations,
      [key]: {
        ...existingTranslation,
        ...translation,
      },
    },
  };
};
export const removeLanguage = (language: string) => {
  const { translations, languages } = mutableLanguagesConfig;
  delete translations[language];
  mutableLanguagesConfig = {
    ...mutableLanguagesConfig,
    translations,
    languages: languages.filter((lang) => lang !== language),
  };
};

export const getLanguages = () => {
  return mutableLanguagesConfig.languages;
};

export const getDefaultLanguage = () => {
  return mutableLanguagesConfig.defaultLanguage;
};

export const addLanguage = (language: string) => {
  const { translations, languages } = mutableLanguagesConfig;
  mutableLanguagesConfig = {
    ...mutableLanguagesConfig,
    translations: {
      ...translations,
      [language]: {},
    },
    languages: [...languages, language],
  };
};

export const setDefaultLanguage = (language: string) => {
  if (mutableLanguagesConfig.languages.includes(language)) {
    mutableLanguagesConfig.defaultLanguage = language;
  }
};
