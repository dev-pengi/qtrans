import { AIProvider } from "../base/base.provider";

export class AnthropicProvider extends AIProvider {
  async generateContent(promptText: string): Promise<string> {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: promptText,
          },
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(
        `Anthropic API Error: ${
          data.error?.message || JSON.stringify(data)
        }`
      );
    }

    return data.content[0].text;
  }
}