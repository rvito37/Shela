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
    <article>
      {/* Cover image — full bleed */}
      {article.cover_image_url && (
        <div className="relative aspect-[2/1] sm:aspect-[3/1] overflow-hidden">
          <img
            src={article.cover_image_url}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="mb-8 text-xs text-muted">
          <Link href="/" className="hover:text-foreground transition-colors">
            ראשי
          </Link>
          <span className="mx-2 text-muted-light">/</span>
          <Link
            href={`/${article.persona.rubric_slug}`}
            className="hover:text-foreground transition-colors"
          >
            {article.persona.rubric_name}
          </Link>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary mb-4">
            {article.persona.rubric_name}
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black leading-[1.1] mb-5">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-lg text-muted leading-relaxed mb-6">
              {article.excerpt}
            </p>
          )}

          {/* Author & meta */}
          <div className="flex items-center gap-3 pt-5 border-t border-border">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-bold text-sm">
              {article.persona.name.charAt(0)}
            </div>
            <div>
              <Link
                href={`/${article.persona.rubric_slug}`}
                className="text-sm font-bold hover:text-primary transition-colors"
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

        {/* Content */}
        <div className="mb-16">
          <MarkdownContent content={article.content ?? ""} />
        </div>

        {/* Author card */}
        <section className="py-8 border-t border-b border-border mb-16">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-black text-lg shrink-0">
              {article.persona.name.charAt(0)}
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-primary mb-1">
                {article.persona.rubric_name}
              </p>
              <Link
                href={`/${article.persona.rubric_slug}`}
                className="font-display font-black text-lg hover:text-primary transition-colors"
              >
                {article.persona.name}
              </Link>
              {article.persona.bio && (
                <p className="text-sm text-muted leading-relaxed mt-1">
                  {article.persona.bio}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-8">
              <hr className="editorial-divider-thick flex-1" />
              <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-foreground shrink-0">
                עוד מ{article.persona.name}
              </h2>
              <hr className="editorial-divider-thick flex-1" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-10">
              {relatedArticles.map((related) => (
                <ArticleCard key={related.id} article={related} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}

function MarkdownContent({ content }: { content: string }) {
  const html = content
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-display font-black mt-8 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-display font-black mt-10 mb-4">$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^- (.+)$/gm, '<li class="ms-4 list-disc">$1</li>')
    .replace(
      /^(\d+)\. (.+)$/gm,
      '<li class="ms-4 list-decimal"><strong>$1.</strong> $2</li>'
    )
    .replace(/\n\n/g, '</p><p class="mb-5">')
    .replace(/^(?!<[hlu])(.+)$/gm, "$1");

  return (
    <div
      className="text-foreground/85 text-[17px] leading-[1.8] [&>p]:mb-5 [&>h2]:text-foreground [&>h3]:text-foreground"
      dangerouslySetInnerHTML={{ __html: `<p class="mb-5">${html}</p>` }}
    />
  );
}
