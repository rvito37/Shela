import { createClient } from "@/lib/supabase/server";
import type { Persona, Article, ArticleWithPersona } from "@/lib/types";

export async function getPersonas(): Promise<Persona[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("personas")
    .select("*")
    .eq("is_active", true)
    .order("created_at");

  if (error) throw error;
  return data ?? [];
}

export async function getPersonaBySlug(
  rubricSlug: string
): Promise<Persona | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("personas")
    .select("*")
    .eq("rubric_slug", rubricSlug)
    .eq("is_active", true)
    .single();

  if (error) return null;
  return data;
}

export async function getArticles(options?: {
  personaId?: string;
  limit?: number;
  offset?: number;
}): Promise<ArticleWithPersona[]> {
  const supabase = await createClient();
  let query = supabase
    .from("articles")
    .select("*, persona:personas(*)")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (options?.personaId) {
    query = query.eq("persona_id", options.personaId);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  if (options?.offset) {
    query = query.range(
      options.offset,
      options.offset + (options.limit ?? 10) - 1
    );
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as ArticleWithPersona[];
}

export async function getArticleBySlug(
  slug: string
): Promise<ArticleWithPersona | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*, persona:personas(*)")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) return null;
  return data as ArticleWithPersona;
}

export async function getLatestArticlesByRubric(
  limit = 3
): Promise<Record<string, ArticleWithPersona[]>> {
  const supabase = await createClient();
  const { data: personas } = await supabase
    .from("personas")
    .select("*")
    .eq("is_active", true);

  if (!personas) return {};

  const result: Record<string, ArticleWithPersona[]> = {};

  for (const persona of personas) {
    const { data: articles } = await supabase
      .from("articles")
      .select("*, persona:personas(*)")
      .eq("persona_id", persona.id)
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(limit);

    if (articles && articles.length > 0) {
      result[persona.rubric_slug] = articles as ArticleWithPersona[];
    }
  }

  return result;
}
