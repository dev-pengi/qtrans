import { languagesCodeMap } from "src/constants";

export type ConfigBase = {
  port: number;
  name: string;
  location: string;
};

export type LLMConfig = {
  active_provider: Provider;
  providers: Partial<Record<Provider, ProviderSettings>>;
 
};

export type Provider = "gemini" | "openai" | "anthropic";

export type AvailableProvider = {
  name: string;
  model: string;
};

export type AvailableProviders = Record<
  Provider,
  AvailableProvider
>;

export type ProviderSettings = {
  model: string;
  api_key: string;
}

export type Language = keyof typeof languagesCodeMap;

export type LanguagesInConfig = {
  defaultLanguage: Language;
  languages: Language[];
};

export type Config = ConfigBase &
  LanguagesInConfig &
  Partial<{
    typeSafe?: boolean;
    llm_config?: LLMConfig;
  }>;


