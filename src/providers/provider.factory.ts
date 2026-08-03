
import { OpenAiProvider } from "./ai/opneAi/openAi.provider";
import { GeminiProvider } from "./ai/gemini/gemini.provider";
import { AnthropicProvider } from "./ai/anthropic/anthropic.base";
import { AIProvider } from "./ai/base/base.provider";
import { LLMConfig } from "../types";


export function createProvider (
  config: LLMConfig
): AIProvider{
  const provider = config.active_provider
  const settings = config.providers[provider]
    if (!settings) {
    throw new Error(`No configuration found for provider "${provider}"`);
  }
  switch(provider){
     case "gemini":
            return new GeminiProvider(settings.api_key , settings.model);

        case "openai":
            return new OpenAiProvider(settings.api_key , settings.model);

        case "anthropic":
            return new AnthropicProvider(settings.api_key , settings.model);
            
        default: 
            throw new Error(`unknown provider ${provider}`)

  }
}