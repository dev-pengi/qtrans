import { Provider } from "../types";

export const AVAILABLE_PROVIDERS = {
  gemini: {
    name: "Google Gemini",
    models: [
      "gemini-2.5-flash",
      "gemini-1.5-flash",
      "gemini-3.5-flash",
    ],
    envVar: "GEMINI_API_KEY",
  },

  openai: {
    name: "OpenAI",
    models: [
      "gpt-4o-mini",
      "GPT-4.1",
      "GPT-5",
    ],
    envVar: "OPENAI_API_KEY",
  },

  anthropic: {
    name: "Anthropic",
    models: [
      "claude-opus-5",
      "claude-sonnet-5",
    ],
    envVar: "ANTHROPIC_API_KEY",
  },

  deepseek: {
    name: "DeepSeek",
    models: [
      "deepseek-flash",
      "deepseek-v4-pro",
    ],
    envVar: "DEEPSEEK_API_KEY",
  },
} as const;

export const DEFAULT_PROVIDER: Provider = "gemini";