"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import { cn, formatDate } from "@/lib/utils";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  status: string;
  content_type: string;
  word_count: number;
  reading_time_minutes: number;
  ai_model_used: string | null;
  created_at: string;
  published_at: string | null;
  persona: {
    name: string;
    name_en: string;
    rubric_name: string;
    rubric_slug: string;
  } | null;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  draft: { label: "טיוטה", color: "bg-primary/10 text-primary" },
  published: { label: "פורסם", color: "bg-secondary/10 text-secondary" },
  scheduled: { label: "מתוזמן", color: "bg-blue-100 text-blue-700" },
  archived: { label: "בארכיון", color: "bg-gray-100 text-gray-600" },
};

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadArticles();
  }, []);

  async function loadArticles() {
    setLoading(true);
    try {
      const res = await adminFetch("/api/articles");
      if (res.ok) {
        const data = await res.json();
        setArticles(data.articles ?? []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    const res = await adminFetch("/api/articles", {
      method: "PATCH",
      body: JSON.stringify({ id, status }),
    });

    if (res.ok) {
      loadArticles();
    }
  }

  async function deleteArticle(id: string, title: string) {
    if (!confirm(`למחוק את "${title}"?`)) return;

    const res = await adminFetch(`/api/articles?id=${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setExpandedId(null);
      loadArticles();
    }
  }

  const filtered =
    filter === "all"
      ? articles
      : articles.filter((a) => a.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-display font-black">ניהול כתבות</h1>
        <span className="text-sm text-muted">{articles.length} כתבות</span>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { key: "all", label: "הכל" },
          { key: "draft", label: "טיוטות" },
          { key: "published", label: "פורסמו" },
          { key: "scheduled", label: "מתוזמנות" },
          { key: "archived", label: "ארכיון" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm transition-colors",
              filter === f.key
                ? "bg-primary text-white"
                : "bg-surface border border-border hover:border-primary/30"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Articles list */}
      {loading ? (
        <p className="text-center text-muted py-12">טוען...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-muted py-12">אין כתבות</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((article) => {
            const status = STATUS_LABELS[article.status] ?? {
              label: article.status,
              color: "bg-gray-100",
            };
            const isExpanded = expandedId === article.id;

            return (
              <div
                key={article.id}
                className="rounded-xl border border-border bg-surface overflow-hidden"
              >
                {/* Header row — clickable */}
                <button
                  onClick={() =>
                    setExpandedId(isExpanded ? null : article.id)
                  }
                  className="w-full p-4 text-start hover:bg-accent/10 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={cn(
                            "text-xs px-2 py-0.5 rounded-full font-medium",
                            status.color
                          )}
                        >
                          {status.label}
                        </span>
                        <span className="text-xs text-muted">
                          {article.content_type}
                        </span>
                        {article.ai_model_used && (
                          <span className="text-xs text-muted">
                            · {article.ai_model_used}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-sm">
                        {article.title}
                      </h3>
                      <p className="text-xs text-muted mt-1">
                        {article.persona?.name} ·{" "}
                        {article.persona?.rubric_name} ·{" "}
                        {article.word_count} מילים ·{" "}
                        {formatDate(article.created_at)}
                      </p>
                    </div>
                    <span className="text-muted text-lg shrink-0">
                      {isExpanded ? "▲" : "▼"}
                    </span>
                  </div>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="border-t border-border">
                    {/* Excerpt */}
                    {article.excerpt && (
                      <div className="px-4 pt-4 pb-2">
                        <p className="text-sm text-muted italic">
                          {article.excerpt}
                        </p>
                      </div>
                    )}

                    {/* Full content */}
                    {article.content && (
                      <div className="px-4 py-3">
                        <div className="bg-background rounded-lg p-4 max-h-[500px] overflow-y-auto">
                          <ArticleContent content={article.content} />
                        </div>
                      </div>
                    )}

                    {/* Actions bar */}
                    <div className="px-4 py-3 border-t border-border flex items-center gap-2 flex-wrap">
                      {article.status === "draft" && (
                        <button
                          onClick={() =>
                            updateStatus(article.id, "published")
                          }
                          className="px-4 py-2 text-sm rounded-lg bg-secondary text-white hover:bg-secondary-dark transition-colors"
                        >
                          פרסם עכשיו
                        </button>
                      )}
                      {article.status === "published" && (
                        <>
                          <a
                            href={`/${article.persona?.rubric_slug}/${article.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-accent/20 transition-colors"
                          >
                            צפה באתר ↗
                          </a>
                          <button
                            onClick={() =>
                              updateStatus(article.id, "archived")
                            }
                            className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-accent/20 transition-colors"
                          >
                            העבר לארכיון
                          </button>
                        </>
                      )}
                      {article.status === "archived" && (
                        <button
                          onClick={() =>
                            updateStatus(article.id, "published")
                          }
                          className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-accent/20 transition-colors"
                        >
                          פרסם מחדש
                        </button>
                      )}
                      <button
                        onClick={() =>
                          deleteArticle(article.id, article.title)
                        }
                        className="px-4 py-2 text-sm rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        מחק
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ArticleContent({ content }: { content: string }) {
  const html = content
    .replace(
      /^### (.+)$/gm,
      '<h3 class="text-lg font-bold mt-5 mb-2">$1</h3>'
    )
    .replace(
      /^## (.+)$/gm,
      '<h2 class="text-xl font-display font-bold mt-6 mb-3">$1</h2>'
    )
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^- (.+)$/gm, '<li class="ms-4 list-disc">$1</li>')
    .replace(
      /^(\d+)\. (.+)$/gm,
      '<li class="ms-4 list-decimal"><strong>$1.</strong> $2</li>'
    )
    .replace(/\n\n/g, '</p><p class="mb-3">')
    .replace(/^(?!<[hlu])(.+)$/gm, "$1");

  return (
    <div
      className="text-sm leading-relaxed text-foreground/85 [&>p]:mb-3 [&>h2]:text-foreground [&>h3]:text-foreground"
      dangerouslySetInnerHTML={{ __html: `<p class="mb-3">${html}</p>` }}
    />
  );
}
