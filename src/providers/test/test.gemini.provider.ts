import { GeminiProvider } from "../ai/gemini/gemini.provider";

import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });
//console.log(process.env.GEMINI_API_KEY);

const run = async () => {
	const provider = new GeminiProvider(process.env.GEMINI_API_KEY!, "gemini-2.5-pro");
	const result = await provider.generateContent(
		'Respond with ONLY this raw JSON',
	);
	console.log("RAW OUTPUT:", result);
};

run().catch(console.error);