import { ArticleCard } from "./ArticleCard";
import type { ArticleWithPersona } from "@/lib/types";

interface ArticleGridProps {
  articles: ArticleWithPersona[];
}

export function ArticleGrid({ articles }: ArticleGridProps) {
  if (articles.length === 0) {
    return (
      <p className="text-center text-muted py-12">אין כתבות עדיין.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
