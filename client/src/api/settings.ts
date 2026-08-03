import { Config, LanguagesInConfig } from "src/types/settings";
import handleFetch from "./fetch";
import { Provider } from "src/types";


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



export const configureLLM = async (
  active_provider: Provider
): Promise<void> => {
  return handleFetch("/api/settings/llm", {
    method: "PUT",
    data: {
      active_provider,
    },
  });
};
