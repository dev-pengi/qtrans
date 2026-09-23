import { AIProvider } from "../base/base.provider";

export class DeepSeekProvider extends AIProvider {
  constructor(apiKey: string, model: string) {
    super(apiKey, model);
  }

  async generateContent(promptText: string): Promise<string> {
    const response = await fetch(
      "https://api.deepseek.com/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: "user",
              content: promptText,
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      const error = await response.text();

      throw new Error(
        `DeepSeek API error (${response.status}): ${error}`,
      );
    }

    const data = await response.json();

    return data.choices[0].message.content;
  }
}