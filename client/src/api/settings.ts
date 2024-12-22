import { Config, LanguagesInConfig } from "src/types/settings";
import handleFetch from "./fetch";

export const fetchSettings = async (): Promise<Config> => {
  return handleFetch("/api/settings");
};

export const configureLanguages = async (
  languagesConfig: LanguagesInConfig
): Promise<Config> => {
  return handleFetch("/api/settings/languages", {
    method: "PUT",
    data: languagesConfig,
  });
};
