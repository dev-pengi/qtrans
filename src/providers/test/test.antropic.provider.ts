import { AnthropicProvider } from "../ai/anthropic/anthropic.base"


const run = async()=>{
  const antropicProvider = new AnthropicProvider(process.env.ANTHROPIC_API_KEY! , "claude-3-5-sonnet-20241022")

  const result = await antropicProvider.generateContent('Respond with exactly: Hello from Antropic',)

  console.log(result)
}

run().catch(console.error)