import Link from "next/link";
import Image from "next/image";
import { cn, formatDate, formatReadingTime } from "@/lib/utils";
import type { ArticleWithPersona } from "@/lib/types";

interface ArticleCardProps {
  article: ArticleWithPersona;
  variant?: "default" | "horizontal";
}

export function ArticleCard({
  article,
  variant = "default",
}: ArticleCardProps) {
  const href = `/${article.persona.rubric_slug}/${article.slug}`;

  if (variant === "horizontal") {
    return (
      <Link href={href} className="group flex gap-4 items-start">
        {article.cover_image_url && (
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden shrink-0">
            <Image
              src={article.cover_image_url}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="128px"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-primary font-medium mb-1">
            {article.persona.rubric_name}
          </p>
          <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
            {article.title}
          </h3>
          <p className="text-sm text-muted">
            {article.persona.name} ·{" "}
            {article.published_at && formatDate(article.published_at)}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="group block">
      {/* Image */}
      {article.cover_image_url && (
        <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3">
          <Image
            src={article.cover_image_url}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}

      {/* Content */}
      <div>
        <p className="text-xs text-primary font-medium mb-1">
          {article.persona.rubric_name}
        </p>
        <h3
          className={cn(
            "font-bold text-foreground group-hover:text-primary transition-colors",
            "text-lg leading-tight mb-2 line-clamp-2"
          )}
        >
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="text-sm text-muted leading-relaxed line-clamp-2 mb-2">
            {article.excerpt}
          </p>
        )}
        <div className="flex items-center gap-2 text-xs text-muted">
          <span className="font-medium text-foreground/70">
            {article.persona.name}
          </span>
          <span>·</span>
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
    </Link>
  );
}
