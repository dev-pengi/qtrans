export type LanguagesConfig = {
  languages: string[];
  defaultLanguage: string;
};

export type Config = {
  name: string;
  port: number;
} & LanguagesConfig;
