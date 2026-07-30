import { AIProvider } from "../base/base.provider";

export class OpenAiProvider extends AIProvider{
  async generateContent(promptText: string): Promise<string> {
    const response = await fetch("https://api.openai.com/v1/responses", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${this.apiKey}`,
  },
  body: JSON.stringify({
    model: this.model,
    input: promptText,
  }),
});

  const data = await response.json()
  if(data.error){
    throw new Error(`open ai error ${data.error.message || JSON.stringify(data.error)}`)
  }
  if (!data.choices || !data.choices[0] || !data.choices[0].message){
    throw new Error('no choices reurned from open ai')
  }
  return data.choices[0].message.content;
  }
}