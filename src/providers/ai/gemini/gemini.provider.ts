import { AIProvider } from "../base/base.provider";


export class GeminiProvider extends AIProvider {
	async generateContent(promptText: string): Promise<string> {
		const response = await fetch(
			`https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					contents: [{ parts: [{ text: promptText }] }],
				}),
			},
		);
		const data = await response.json();

		if (data.error) {
			throw new Error(`Gemini API Error: ${data.error.message || JSON.stringify(data.error)}`);
		}
		if (!data.candidates || !data.candidates[0]) {
			throw new Error("No candidates returned from Gemini API");
		}

		return data.candidates[0].content.parts[0].text;
	}
}