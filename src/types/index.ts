export type ConfigBase = {
  port: number;
  name: string;
  location: string;
};

export type LLMConfig = {
  model: string;
  api_key: string;
};

export type Config = ConfigBase &
  Partial<{
    typeSafe?: boolean;
    llm_config?: LLMConfig;
  }>;
