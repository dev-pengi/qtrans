export type ConfigBase = {
  port: number;
  name: string;
  location: string;
};

type Model = "gemini-1.5-flash" | "gemini-2.5-flash";

export type LLMConfig = {
  model: Model;
  api_key: string;
  prompt_strategy?: PromptStrategy;
};

export type PromptStrategy = "positive_prompt" | "negative_prompt";

export type Config = ConfigBase &
  Partial<{
    typeSafe?: boolean;
    llm_config?: LLMConfig;
  }>;
