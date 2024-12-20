export type TranslationValue = {
  [lang: string]: string;
};

export type Translation = {
  key: string;
  value: {
    [lang: string]: string;
  };
};
