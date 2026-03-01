import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getArticleBySlug, getArticles } from "@/lib/data";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { formatDate, formatReadingTime } from "@/lib/utils";

interface ArticlePageProps {
  params: Promise<{ rubric: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: article.seo_title ?? article.title,
    description: article.seo_description ?? article.excerpt ?? "",
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Get more articles by same persona
  const moreArticles = await getArticles({
    personaId: article.persona_id,
    limit: 4,
  });
  const relatedArticles = moreArticles.filter((a) => a.id !== article.id).slice(0, 3);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-muted">
        <Link href="/" className="hover:text-primary transition-colors">
          ראשי
        </Link>
        <span className="mx-2">›</span>
        <Link
          href={`/${article.persona.rubric_slug}`}
          className="hover:text-primary transition-colors"
        >
          {article.persona.rubric_name}
        </Link>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-display font-black leading-tight mb-4">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="text-lg text-muted leading-relaxed mb-4">
            {article.excerpt}
          </p>
        )}

        {/* Author & meta */}
        <div className="flex items-center gap-3 py-4 border-y border-border">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-bold">
            {article.persona.name.charAt(0)}
          </div>
          <div>
            <Link
              href={`/${article.persona.rubric_slug}`}
              className="font-medium hover:text-primary transition-colors"
            >
              {article.persona.name}
            </Link>
            <div className="text-xs text-muted flex gap-2">
              {article.published_at && (
                <span>{formatDate(article.published_at)}</span>
              )}
              {article.reading_time_minutes > 0 && (
                <>
                  <span>·</span>
                  <span>
                    {formatReadingTime(article.reading_time_minutes)}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Cover image */}
      {article.cover_image_url && (
        <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-8">
          <img
            src={article.cover_image_url}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content — render markdown as HTML */}
      <div className="prose prose-lg max-w-none mb-12 article-content">
        <MarkdownContent content={article.content ?? ""} />
      </div>

      {/* Author card */}
      <section className="rounded-xl border border-border bg-surface p-6 mb-12">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-black text-xl shrink-0">
            {article.persona.name.charAt(0)}
          </div>
          <div>
            <Link
              href={`/${article.persona.rubric_slug}`}
              className="font-bold text-lg hover:text-primary transition-colors"
            >
              {article.persona.name}
            </Link>
            <p className="text-sm text-primary/80 font-medium mb-1">
              {article.persona.rubric_name}
            </p>
            {article.persona.bio && (
              <p className="text-sm text-muted leading-relaxed">
                {article.persona.bio}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Related articles */}
      {relatedArticles.length > 0 && (
        <section>
          <h2 className="text-2xl font-display font-black mb-6">
            עוד מ{article.persona.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedArticles.map((related) => (
              <ArticleCard key={related.id} article={related} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

function MarkdownContent({ content }: { content: string }) {
  // Simple markdown-to-HTML conversion for basic formatting
  const html = content
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold mt-6 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-display font-bold mt-8 mb-4">$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^- (.+)$/gm, '<li class="ms-4 list-disc">$1</li>')
    .replace(
      /^(\d+)\. (.+)$/gm,
      '<li class="ms-4 list-decimal"><strong>$1.</strong> $2</li>'
    )
    .replace(/\n\n/g, '</p><p class="mb-4">')
    .replace(/^(?!<[hlu])(.+)$/gm, "$1");

  return (
    <div
      className="text-foreground/90 leading-relaxed [&>p]:mb-4 [&>h2]:text-foreground [&>h3]:text-foreground"
      dangerouslySetInnerHTML={{ __html: `<p class="mb-4">${html}</p>` }}
    />
  );
}
