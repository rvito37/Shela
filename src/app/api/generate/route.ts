import { NextRequest, NextResponse } from "next/server";
import { generateArticle } from "@/lib/ai/generate";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ContentType } from "@/lib/types";

export async function POST(request: NextRequest) {
  // Simple auth check
  const authHeader = request.headers.get("x-admin-key");
  if (authHeader !== process.env.ADMIN_SECRET_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      personaSlug,
      topic,
      contentType = "article",
      aiModel = "claude",
      additionalInstructions,
    } = body as {
      personaSlug: string;
      topic: string;
      contentType?: ContentType;
      aiModel?: "claude" | "openai";
      additionalInstructions?: string;
    };

    if (!personaSlug || !topic) {
      return NextResponse.json(
        { error: "personaSlug and topic are required" },
        { status: 400 }
      );
    }

    // Get persona from DB
    const supabase = createAdminClient();
    const { data: persona, error: personaError } = await supabase
      .from("personas")
      .select("id")
      .eq("slug", personaSlug)
      .single();

    if (personaError || !persona) {
      return NextResponse.json(
        { error: `Persona not found: ${personaSlug}` },
        { status: 404 }
      );
    }

    // Generate article
    const result = await generateArticle({
      personaSlug,
      topic,
      contentType,
      aiModel,
      additionalInstructions,
    });

    // Save as draft to DB
    const { data: article, error: insertError } = await supabase
      .from("articles")
      .insert({
        persona_id: persona.id,
        title: result.title,
        slug: result.slug,
        excerpt: result.excerpt,
        content: result.content,
        content_type: contentType,
        seo_title: result.seo_title,
        seo_description: result.seo_description,
        word_count: result.word_count,
        reading_time_minutes: result.reading_time_minutes,
        ai_model_used: result.ai_model_used,
        generation_prompt: result.generation_prompt,
        status: "draft",
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: `DB insert failed: ${insertError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, article });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
