import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function generateWithOpenAI(options: {
  system: string;
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}): Promise<string> {
  const response = await client.chat.completions.create({
    model: "gpt-4o",
    max_tokens: options.maxTokens ?? 4096,
    temperature: options.temperature ?? 0.8,
    messages: [
      { role: "system", content: options.system },
      { role: "user", content: options.prompt },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("Empty response from OpenAI");
  }

  return content;
}
