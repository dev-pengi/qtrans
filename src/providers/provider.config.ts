import { Provider } from "../types";

export const AVAILABLE_PROVIDERS = {
  gemini: {
    name: "Google Gemini",
    model: "gemini-2.5-flash",
    envVar: "GEMINI_API_KEY",
  },
  openai: {
    name: "OpenAI",
    model: "gpt-4o-mini",
    envVar: "OPENAI_API_KEY",
  },
  anthropic: {
    name: "Anthropic",
    model: "claude-3-5-sonnet-20241022",
    envVar: "ANTHROPIC_API_KEY",
  },
} as const;

export const DEFAULT_PROVIDER: Provider = "gemini";