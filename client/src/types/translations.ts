import { Language } from "./settings";

export type TranslationValue = {
  [lang: string]: string;
};

export type Translation = {
  key: string;
  value: TranslationValue;
};

export type Prompt = {
  key: string;
  languages: `${Language}-${string}`[];
  providedValues?: TranslationValue;
};
