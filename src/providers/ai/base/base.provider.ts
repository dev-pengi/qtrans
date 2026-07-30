export abstract class AIProvider {
    constructor(
        protected apiKey: string,
        protected model: string,
    ) {}

    abstract generateContent(promptText: string): Promise<string>;
}