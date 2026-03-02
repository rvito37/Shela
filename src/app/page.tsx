import Link from "next/link";
import { getArticles } from "@/lib/data";
import { FeaturedArticle } from "@/components/articles/FeaturedArticle";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { RUBRICS, SITE_NAME } from "@/lib/constants";
import type { ArticleWithPersona } from "@/lib/types";

export default async function HomePage() {
  let articles: ArticleWithPersona[] = [];
  try {
    articles = await getArticles({ limit: 13 });
  } catch {
    // Supabase not configured yet — show placeholder
  }

  const featured = articles[0];
  const latest = articles.slice(1, 7);
  const more = articles.slice(7, 13);

  if (articles.length === 0) {
    return <PlaceholderHome />;
  }

  return (
    <div>
      {/* Featured article — full bleed */}
      {featured && (
        <section className="mb-10">
          <FeaturedArticle article={featured} />
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Latest articles */}
        {latest.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <hr className="editorial-divider-thick flex-1" />
              <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-foreground shrink-0">
                כתבות אחרונות
              </h2>
              <hr className="editorial-divider-thick flex-1" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
              {latest.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        )}

        {/* Rubrics nav */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <hr className="editorial-divider-thick flex-1" />
            <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-foreground shrink-0">
              רובריקות
            </h2>
            <hr className="editorial-divider-thick flex-1" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-0 border border-border">
            {RUBRICS.map((rubric, i) => (
              <Link
                key={rubric.slug}
                href={`/${rubric.slug}`}
                className="group block p-5 text-center border-e border-b border-border last:border-e-0 hover:bg-surface-alt transition-colors"
              >
                <span className="block text-xs font-bold tracking-[0.1em] uppercase text-foreground group-hover:text-primary transition-colors">
                  {rubric.name}
                </span>
                <span className="block text-[11px] text-muted mt-1">
                  {rubric.persona}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* More articles */}
        {more.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <hr className="editorial-divider-thick flex-1" />
              <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-foreground shrink-0">
                עוד בשלה
              </h2>
              <hr className="editorial-divider-thick flex-1" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
              {more.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function PlaceholderHome() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-foreground text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">
            ברוכות הבאות
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black leading-[1.1] mb-4 max-w-2xl">
            {SITE_NAME}
          </h1>
          <p className="text-lg text-white/60 max-w-xl">
            מגזין דיגיטלי לנשים ישראליות — תרבות, זוגיות, אמהות, יהדות, יופי,
            קריירה ואוכל.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Columnists */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <hr className="editorial-divider-thick flex-1" />
            <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-foreground shrink-0">
              הקולומניסטיות שלנו
            </h2>
            <hr className="editorial-divider-thick flex-1" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-0 border border-border">
            {RUBRICS.map((rubric) => (
              <Link
                key={rubric.slug}
                href={`/${rubric.slug}`}
                className="group block p-5 text-center border-e border-b border-border last:border-e-0 hover:bg-surface-alt transition-colors"
              >
                <span className="block text-xs font-bold tracking-[0.1em] uppercase text-foreground group-hover:text-primary transition-colors">
                  {rubric.persona}
                </span>
                <span className="block text-[11px] text-muted mt-1">
                  {rubric.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Setup notice */}
        <section className="text-center py-12 border-t border-border">
          <p className="text-sm text-muted mb-1">
            הגדירו את Supabase כדי לראות כתבות כאן
          </p>
          <p className="text-xs text-muted/60">
            העתיקו את .env.example ל-.env.local והזינו את פרטי Supabase
          </p>
        </section>
      </div>
    </div>
  );
}
