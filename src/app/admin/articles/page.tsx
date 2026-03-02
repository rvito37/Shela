"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import { cn, formatDate } from "@/lib/utils";

interface Article {
  id: string;
  title: string;
  slug: string;
  status: string;
  content_type: string;
  word_count: number;
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

            return (
              <div
                key={article.id}
                className="rounded-xl border border-border bg-surface p-4"
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
                    <h3 className="font-bold text-sm truncate">
                      {article.title}
                    </h3>
                    <p className="text-xs text-muted mt-1">
                      {article.persona?.name} · {article.persona?.rubric_name}{" "}
                      · {article.word_count} מילים ·{" "}
                      {formatDate(article.created_at)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {article.status === "draft" && (
                      <button
                        onClick={() => updateStatus(article.id, "published")}
                        className="px-3 py-1.5 text-xs rounded-lg bg-secondary text-white hover:bg-secondary-dark transition-colors"
                      >
                        פרסם
                      </button>
                    )}
                    {article.status === "published" && (
                      <button
                        onClick={() => updateStatus(article.id, "archived")}
                        className="px-3 py-1.5 text-xs rounded-lg border border-border hover:bg-accent/20 transition-colors"
                      >
                        ארכיון
                      </button>
                    )}
                    <button
                      onClick={() =>
                        deleteArticle(article.id, article.title)
                      }
                      className="px-3 py-1.5 text-xs rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      מחק
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
