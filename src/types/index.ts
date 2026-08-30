export type ConfigBase = {
  port: number;
  name: string;
  location: string;
};


export type Provider = "openai" | "gemini" | "anthropic"

export type ProviderSettings = {
  model: string;
  api_key: string;
}

export type LLMConfig = {
  active_provider: Provider;
  providers: Partial<Record<Provider, ProviderSettings>>;
  prompt_strategy?: PromptStrategy;
};

export type PromptStrategy = "positive_prompt" | "negative_prompt";

export type Config = ConfigBase &
  Partial<{
    typeSafe?: boolean;
    llm_config?: LLMConfig;
    translationFileMode?: TranslationsFileMode
  }>;



export type TranslationsFileMode = "single" | "separate"