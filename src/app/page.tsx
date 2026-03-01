import Link from "next/link";
import { getArticles } from "@/lib/data";
import { FeaturedArticle } from "@/components/articles/FeaturedArticle";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { RUBRICS } from "@/lib/constants";
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Featured article */}
      {featured && (
        <section className="mb-12">
          <FeaturedArticle article={featured} />
        </section>
      )}

      {/* Latest articles */}
      {latest.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-display font-black mb-6">
            כתבות אחרונות
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {latest.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* Rubrics nav */}
      <section className="mb-12">
        <h2 className="text-2xl font-display font-black mb-6">רובריקות</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {RUBRICS.map((rubric) => (
            <Link
              key={rubric.slug}
              href={`/${rubric.slug}`}
              className="block p-4 rounded-xl border border-border bg-surface hover:border-primary/30 hover:shadow-sm transition-all text-center"
            >
              <span className="text-2xl font-display font-black text-primary/20 block mb-1">
                {rubric.persona.charAt(0)}
              </span>
              <span className="font-medium text-sm">{rubric.name}</span>
              <span className="block text-xs text-muted mt-0.5">
                {rubric.persona}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* More articles */}
      {more.length > 0 && (
        <section>
          <h2 className="text-2xl font-display font-black mb-6">עוד בשלה</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {more.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function PlaceholderHome() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <section className="mb-12">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-tl from-primary/20 via-accent/30 to-secondary/10 aspect-[16/7] sm:aspect-[16/6] flex items-end">
          <div className="p-6 sm:p-8">
            <p className="text-sm font-medium text-primary mb-2">
              ברוכות הבאות
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black leading-tight mb-3">
              שלה — מגזין לנשים ישראליות
            </h1>
            <p className="text-foreground/70 max-w-2xl">
              תרבות, זוגיות, אמהות, יהדות, יופי, קריירה ואוכל — עם
              קולומניסטיות שמדברות אלייך.
            </p>
          </div>
        </div>
      </section>

      {/* Columnists */}
      <section className="mb-12">
        <h2 className="text-2xl font-display font-black mb-6">
          הקולומניסטיות שלנו
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {RUBRICS.map((rubric) => (
            <Link
              key={rubric.slug}
              href={`/${rubric.slug}`}
              className="group block p-5 rounded-xl border border-border bg-surface hover:border-primary/30 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-black text-xl mb-3">
                {rubric.persona.charAt(0)}
              </div>
              <h3 className="font-bold group-hover:text-primary transition-colors">
                {rubric.persona}
              </h3>
              <p className="text-sm text-primary/80 font-medium">
                {rubric.name}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Setup notice */}
      <section className="text-center py-12 text-muted">
        <p className="text-lg mb-2">
          הגדירו את Supabase כדי לראות כתבות כאן
        </p>
        <p className="text-sm">
          העתיקו את .env.example ל-.env.local והזינו את פרטי Supabase
        </p>
      </section>
    </div>
  );
}
