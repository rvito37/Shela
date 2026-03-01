export type ContentType = "article" | "quick_take" | "list" | "qa" | "column";
export type ArticleStatus = "draft" | "scheduled" | "published" | "archived";

export interface Persona {
  id: string;
  name: string;
  name_en: string;
  slug: string;
  bio: string | null;
  avatar_url: string | null;
  style_prompt: string | null;
  ai_model: string;
  rubric_name: string;
  rubric_slug: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: string;
  persona_id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  content_type: ContentType;
  cover_image_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  status: ArticleStatus;
  published_at: string | null;
  scheduled_for: string | null;
  ai_model_used: string | null;
  generation_prompt: string | null;
  word_count: number;
  reading_time_minutes: number;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface ArticleWithPersona extends Article {
  persona: Persona;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}
