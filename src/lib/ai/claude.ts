import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function generateWithClaude(options: {
  system: string;
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}): Promise<string> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-6-20250514",
    max_tokens: options.maxTokens ?? 4096,
    temperature: options.temperature ?? 0.8,
    system: options.system,
    messages: [
      {
        role: "user",
        content: options.prompt,
      },
    ],
  });

  const block = message.content[0];
  if (block.type === "text") {
    return block.text;
  }

  throw new Error("Unexpected response type from Claude");
}
