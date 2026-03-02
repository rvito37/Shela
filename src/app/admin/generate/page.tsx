"use client";

import { useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import { RUBRICS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const CONTENT_TYPES = [
  { value: "article", label: "מאמר", desc: "800-1500 מילים" },
  { value: "quick_take", label: "בקצרה", desc: "200-400 מילים" },
  { value: "list", label: "רשימה", desc: "500-800 מילים" },
  { value: "qa", label: "שאלות ותשובות", desc: "4-6 שאלות" },
  { value: "column", label: "טור שבועי", desc: "600-1000 מילים" },
];

const AI_MODELS = [
  { value: "claude", label: "Claude Sonnet" },
  { value: "openai", label: "GPT-4o" },
];

export default function GeneratePage() {
  const [personaSlug, setPersonaSlug] = useState<string>(RUBRICS[0].slug);
  const [topic, setTopic] = useState("");
  const [contentType, setContentType] = useState("article");
  const [aiModel, setAiModel] = useState("claude");
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    article?: { id: string; title: string; excerpt: string; content: string };
    error?: string;
  } | null>(null);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await adminFetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({
          personaSlug,
          topic: topic.trim(),
          contentType,
          aiModel,
          additionalInstructions: additionalInstructions.trim() || undefined,
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ success: false, error: "שגיאת רשת" });
    } finally {
      setLoading(false);
    }
  }

  async function handlePublish(articleId: string) {
    const res = await adminFetch("/api/articles", {
      method: "PATCH",
      body: JSON.stringify({ id: articleId, status: "published" }),
    });

    if (res.ok) {
      setResult((prev) =>
        prev?.article
          ? {
              ...prev,
              article: { ...prev.article },
              success: true,
            }
          : prev
      );
      alert("הכתבה פורסמה!");
    }
  }

  const selectedRubric = RUBRICS.find((r) => r.slug === personaSlug);

  return (
    <div>
      <h1 className="text-3xl font-display font-black mb-6">יצירת תוכן</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <form onSubmit={handleGenerate} className="space-y-5">
          {/* Persona */}
          <div>
            <label className="block text-sm font-medium mb-2">
              בחרי קולומניסטית
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {RUBRICS.map((rubric) => (
                <button
                  key={rubric.slug}
                  type="button"
                  onClick={() => setPersonaSlug(rubric.slug)}
                  className={cn(
                    "p-3 rounded-lg border text-start transition-all text-sm",
                    personaSlug === rubric.slug
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-surface hover:border-primary/30"
                  )}
                >
                  <span className="font-bold block">{rubric.persona}</span>
                  <span className="text-xs text-muted">{rubric.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Topic */}
          <div>
            <label className="block text-sm font-medium mb-2">נושא</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="למשל: למה כולנו מכורות לטיקטוק"
              className="w-full px-4 py-3 rounded-lg border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Content type */}
          <div>
            <label className="block text-sm font-medium mb-2">
              סוג תוכן
            </label>
            <div className="flex flex-wrap gap-2">
              {CONTENT_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setContentType(type.value)}
                  className={cn(
                    "px-3 py-2 rounded-lg border text-sm transition-all",
                    contentType === type.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-surface hover:border-primary/30"
                  )}
                >
                  {type.label}
                  <span className="text-xs text-muted block">
                    {type.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* AI Model */}
          <div>
            <label className="block text-sm font-medium mb-2">מודל AI</label>
            <div className="flex gap-2">
              {AI_MODELS.map((model) => (
                <button
                  key={model.value}
                  type="button"
                  onClick={() => setAiModel(model.value)}
                  className={cn(
                    "px-4 py-2 rounded-lg border text-sm transition-all",
                    aiModel === model.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-surface hover:border-primary/30"
                  )}
                >
                  {model.label}
                </button>
              ))}
            </div>
          </div>

          {/* Additional instructions */}
          <div>
            <label className="block text-sm font-medium mb-2">
              הנחיות נוספות (אופציונלי)
            </label>
            <textarea
              value={additionalInstructions}
              onChange={(e) => setAdditionalInstructions(e.target.value)}
              placeholder="למשל: תתמקדי בנשים בגיל 30-40, תביאי דוגמאות מהחיים"
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary resize-y"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !topic.trim()}
            className={cn(
              "w-full py-3 rounded-lg font-bold text-white transition-colors",
              loading
                ? "bg-muted cursor-wait"
                : "bg-primary hover:bg-primary-dark"
            )}
          >
            {loading ? "✨ מייצרת תוכן..." : "✨ צור כתבה"}
          </button>

          {loading && (
            <p className="text-sm text-muted text-center">
              זה יכול לקחת 15-30 שניות...
            </p>
          )}
        </form>

        {/* Result */}
        <div>
          {result?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
              <p className="font-bold mb-1">שגיאה</p>
              <p className="text-sm">{result.error}</p>
            </div>
          )}

          {result?.success && result.article && (
            <div className="rounded-xl border border-border bg-surface overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-border bg-secondary/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                    טיוטה
                  </span>
                  <span className="text-xs text-muted">
                    {selectedRubric?.persona}
                  </span>
                </div>
                <h2 className="text-xl font-bold">{result.article.title}</h2>
                <p className="text-sm text-muted mt-1">
                  {result.article.excerpt}
                </p>
              </div>

              {/* Content preview */}
              <div className="p-4 max-h-96 overflow-y-auto">
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {result.article.content?.slice(0, 2000)}
                  {(result.article.content?.length ?? 0) > 2000 && "..."}
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-border flex gap-2">
                <button
                  onClick={() => handlePublish(result.article!.id)}
                  className="flex-1 py-2 rounded-lg bg-secondary text-white font-medium hover:bg-secondary-dark transition-colors"
                >
                  פרסם עכשיו
                </button>
                <button
                  onClick={() => {
                    setResult(null);
                    setTopic("");
                  }}
                  className="px-4 py-2 rounded-lg border border-border hover:bg-accent/20 transition-colors"
                >
                  צור עוד
                </button>
              </div>
            </div>
          )}

          {!result && !loading && (
            <div className="flex items-center justify-center h-64 rounded-xl border border-dashed border-border text-muted">
              <div className="text-center">
                <p className="text-4xl mb-2">✨</p>
                <p>בחרי קולומניסטית ונושא, וה-AI ייצור תוכן</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
