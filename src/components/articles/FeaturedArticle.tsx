import Link from "next/link";
import Image from "next/image";
import { formatDate, formatReadingTime } from "@/lib/utils";
import type { ArticleWithPersona } from "@/lib/types";

interface FeaturedArticleProps {
  article: ArticleWithPersona;
}

export function FeaturedArticle({ article }: FeaturedArticleProps) {
  const href = `/${article.persona.rubric_slug}/${article.slug}`;

  return (
    <Link href={href} className="group block">
      <div className="relative rounded-2xl overflow-hidden">
        {/* Image */}
        {article.cover_image_url && (
          <div className="relative aspect-[16/7] sm:aspect-[16/6]">
            <Image
              src={article.cover_image_url}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="100vw"
              priority
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
          </div>
        )}

        {/* Content overlay */}
        <div className="absolute bottom-0 start-0 end-0 p-6 sm:p-8 text-background">
          <p className="text-sm font-medium text-accent mb-2">
            {article.persona.rubric_name} · {article.persona.name}
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black leading-tight mb-3">
            {article.title}
          </h2>
          {article.excerpt && (
            <p className="text-sm sm:text-base text-background/80 line-clamp-2 max-w-2xl mb-3">
              {article.excerpt}
            </p>
          )}
          <div className="flex items-center gap-2 text-xs text-background/60">
            {article.published_at && (
              <span>{formatDate(article.published_at)}</span>
            )}
            {article.reading_time_minutes > 0 && (
              <>
                <span>·</span>
                <span>{formatReadingTime(article.reading_time_minutes)}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
