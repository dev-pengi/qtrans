import dotenv from "dotenv";
import { OpenAiProvider } from "../ai/opneAi/openAi.provider";

dotenv.config({ path: ".env.test" });

const run = async () => {
  const provider = new OpenAiProvider(
    process.env.OPENAI_API_KEY!,
    "gpt-4o-mini"
  );

  const result = await provider.generateContent(
    "Respond with exactly: Hello from OpenAI"
  );

  console.log( result);
};

run().catch(console.error);