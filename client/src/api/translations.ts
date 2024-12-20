import { Translation, TranslationValue } from "src/types";
import handleFetch from "./fetch";

export const fetchAllTranslations = async (): Promise<Translation[]> => {
  return handleFetch("/api/translations");
};

export const fetchTranslation = async (key: string): Promise<Translation> => {
  return handleFetch(`/api/translations/${key}`);
};

export const createTranslation = async (
  key: string,
  translation: TranslationValue
): Promise<Translation> => {
  return handleFetch("/api/translations", {
    method: "POST",
    data: { key, translation },
  });
};

export const updateTranslation = async (
  key: string,
  translation: TranslationValue
): Promise<Translation> => {
  return handleFetch(`/api/translations/${key}`, {
    data: { translation },
    method: "PATCH",
  });
};

export const deleteTranslation = async (key: string) => {
  return handleFetch(`/api/translations/${key}`, {
    method: "DELETE",
  });
};
