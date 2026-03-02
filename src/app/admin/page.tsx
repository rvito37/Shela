"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/admin-fetch";
import { RUBRICS } from "@/lib/constants";

interface ArticleSummary {
  id: string;
  title: string;
  status: string;
  created_at: string;
  persona: { name: string; rubric_name: string } | null;
}

export default function AdminDashboard() {
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadArticles();
  }, []);

  async function loadArticles() {
    try {
      const res = await adminFetch("/api/articles");
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to load");
        return;
      }
      const data = await res.json();
      setArticles(data.articles ?? []);
    } catch {
      setError("שגיאת רשת");
    } finally {
      setLoading(false);
    }
  }

  const drafts = articles.filter((a) => a.status === "draft");
  const published = articles.filter((a) => a.status === "published");
  const scheduled = articles.filter((a) => a.status === "scheduled");

  return (
    <div>
      <h1 className="text-3xl font-display font-black mb-6">דשבורד</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
          {error === "Unauthorized"
            ? "מפתח הניהול שגוי. נסי שוב."
            : error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="סה״כ כתבות" value={articles.length} />
        <StatCard label="פורסמו" value={published.length} color="text-secondary" />
        <StatCard label="טיוטות" value={drafts.length} color="text-primary" />
        <StatCard label="מתוזמנות" value={scheduled.length} color="text-muted" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Link
          href="/admin/generate"
          className="flex items-center gap-3 p-5 rounded-xl border border-border bg-surface hover:border-primary/30 hover:shadow-sm transition-all"
        >
          <span className="text-3xl">✨</span>
          <div>
            <h3 className="font-bold">יצירת כתבה חדשה</h3>
            <p className="text-sm text-muted">
              בחרי פרסונה, נושא, וה-AI ייצור תוכן
            </p>
          </div>
        </Link>
        <Link
          href="/admin/articles"
          className="flex items-center gap-3 p-5 rounded-xl border border-border bg-surface hover:border-primary/30 hover:shadow-sm transition-all"
        >
          <span className="text-3xl">📝</span>
          <div>
            <h3 className="font-bold">ניהול כתבות</h3>
            <p className="text-sm text-muted">
              צפה, ערוך, פרסם או מחק כתבות
            </p>
          </div>
        </Link>
      </div>

      {/* Recent drafts */}
      {drafts.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">
            טיוטות אחרונות ({drafts.length})
          </h2>
          <div className="space-y-2">
            {drafts.slice(0, 5).map((article) => (
              <div
                key={article.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface"
              >
                <div>
                  <p className="font-medium text-sm">{article.title}</p>
                  <p className="text-xs text-muted">
                    {article.persona?.name} · {article.persona?.rubric_name}
                  </p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                  טיוטה
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {loading && (
        <p className="text-center text-muted py-12">טוען...</p>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  color = "text-foreground",
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 text-center">
      <p className={`text-3xl font-display font-black ${color}`}>{value}</p>
      <p className="text-sm text-muted mt-1">{label}</p>
    </div>
  );
}
