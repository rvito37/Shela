import { generateWithClaude } from "./claude";
import { generateWithOpenAI } from "./openai";
import { getPersonaPrompt, buildGenerationPrompt } from "./prompts";
import { slugify } from "@/lib/utils";
import type { ContentType } from "@/lib/types";

export interface GenerationRequest {
  personaSlug: string;
  topic: string;
  contentType: ContentType;
  aiModel?: "claude" | "openai";
  additionalInstructions?: string;
}

export interface GenerationResult {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  seo_title: string;
  seo_description: string;
  word_count: number;
  reading_time_minutes: number;
  ai_model_used: string;
  generation_prompt: string;
}

export async function generateArticle(
  request: GenerationRequest
): Promise<GenerationResult> {
  const systemPrompt = getPersonaPrompt(request.personaSlug);
  const userPrompt = buildGenerationPrompt({
    topic: request.topic,
    contentType: request.contentType,
    additionalInstructions: request.additionalInstructions,
  });

  const model = request.aiModel ?? "claude";
  let rawResponse: string;

  if (model === "claude") {
    rawResponse = await generateWithClaude({
      system: systemPrompt,
      prompt: userPrompt,
    });
  } else {
    rawResponse = await generateWithOpenAI({
      system: systemPrompt,
      prompt: userPrompt,
    });
  }

  // Parse JSON response — strip markdown code blocks if present
  const cleaned = rawResponse
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let parsed: {
    title: string;
    excerpt: string;
    content: string;
    seo_title: string;
    seo_description: string;
  };

  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(
      `Failed to parse AI response as JSON. Raw response: ${rawResponse.slice(0, 200)}...`
    );
  }

  // Calculate word count and reading time
  const wordCount = parsed.content
    .replace(/[#*_\[\]()]/g, "")
    .split(/\s+/)
    .filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Generate slug from title
  const timestamp = Date.now().toString(36);
  const slug = slugify(parsed.title) || `article-${timestamp}`;

  return {
    title: parsed.title,
    slug: `${slug}-${timestamp}`,
    excerpt: parsed.excerpt,
    content: parsed.content,
    seo_title: parsed.seo_title,
    seo_description: parsed.seo_description,
    word_count: wordCount,
    reading_time_minutes: readingTime,
    ai_model_used: model === "claude" ? "claude-sonnet-4-6" : "gpt-4o",
    generation_prompt: `${request.topic} (${request.contentType})`,
  };
}
