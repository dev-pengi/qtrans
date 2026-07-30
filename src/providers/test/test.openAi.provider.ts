import dotenv from "dotenv";
import { OpenAiProvider } from "../ai/opneAi/openAi.provider";

dotenv.config({ path: ".env.test" });

const run = async () => {
  const provider = new OpenAiProvider(
    process.env.OPENAI_API_KEY!,
    "gpt-5-nano"
  );

  const result = await provider.generateContent(
    "Respond with exactly: Hello from OpenAI"
  );

  console.log("RAW OUTPUT:", result);
};

run().catch(console.error);