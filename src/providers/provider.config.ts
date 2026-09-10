import { Provider } from "../types";

export const AVAILABLE_PROVIDERS = {
  gemini: {
    name: "Google Gemini",
    models: ["gemini-2.5-flash"], // add other apropreate models 
    envVar: "GEMINI_API_KEY",
  },
  openai: {
    name: "OpenAI",
    models: ["gpt-4o-mini"],
    envVar: "OPENAI_API_KEY",
  },
  anthropic: {
    name: "Anthropic",
    models: ["claude-3-5-sonnet-20241022"],
    envVar: "ANTHROPIC_API_KEY",
  },
} as const;

export const DEFAULT_PROVIDER: Provider = "gemini";