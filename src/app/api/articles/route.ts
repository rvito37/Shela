import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// GET — list all articles (admin)
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("x-admin-key");
  if (authHeader !== process.env.ADMIN_SECRET_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const personaSlug = searchParams.get("persona");

  let query = supabase
    .from("articles")
    .select("*, persona:personas(name, name_en, slug, rubric_name, rubric_slug)")
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  if (personaSlug) {
    const { data: persona } = await supabase
      .from("personas")
      .select("id")
      .eq("slug", personaSlug)
      .single();

    if (persona) {
      query = query.eq("persona_id", persona.id);
    }
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ articles: data });
}

// PATCH — update article (status, content, etc.)
export async function PATCH(request: NextRequest) {
  const authHeader = request.headers.get("x-admin-key");
  if (authHeader !== process.env.ADMIN_SECRET_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Article id is required" },
        { status: 400 }
      );
    }

    // If publishing, set published_at
    if (updates.status === "published" && !updates.published_at) {
      updates.published_at = new Date().toISOString();
    }

    updates.updated_at = new Date().toISOString();

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("articles")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, article: data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE — delete article
export async function DELETE(request: NextRequest) {
  const authHeader = request.headers.get("x-admin-key");
  if (authHeader !== process.env.ADMIN_SECRET_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Article id is required" },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("articles").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
