import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ArticleWithPersona } from "@/lib/types";

interface ArticleCardProps {
  article: ArticleWithPersona;
  variant?: "default" | "horizontal";
  showImage?: boolean;
}

export function ArticleCard({
  article,
  variant = "default",
  showImage = true,
}: ArticleCardProps) {
  const href = `/${article.persona.rubric_slug}/${article.slug}`;

  if (variant === "horizontal") {
    return (
      <Link href={href} className="group flex gap-5 items-start py-5 border-b border-border last:border-b-0">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-primary mb-2">
            {article.persona.rubric_name}
          </p>
          <h3 className="font-display font-black text-foreground group-hover:text-primary transition-colors text-lg leading-tight mb-2 line-clamp-2">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="text-sm text-muted leading-relaxed line-clamp-2 mb-2">
              {article.excerpt}
            </p>
          )}
          <p className="text-xs text-muted">
            {article.persona.name}
          </p>
        </div>
        {showImage && article.cover_image_url && (
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 overflow-hidden shrink-0">
            <Image
              src={article.cover_image_url}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="128px"
            />
          </div>
        )}
      </Link>
    );
  }

  return (
    <Link href={href} className="group block">
      {/* Image */}
      {showImage && article.cover_image_url && (
        <div className="relative aspect-[4/3] overflow-hidden mb-4">
          <Image
            src={article.cover_image_url}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}

      {/* Content */}
      <div>
        <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-primary mb-2">
          {article.persona.rubric_name}
        </p>
        <h3
          className={cn(
            "font-display font-black text-foreground group-hover:text-primary transition-colors",
            "text-xl leading-tight mb-2 line-clamp-3"
          )}
        >
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="text-sm text-muted leading-relaxed line-clamp-2 mb-3">
            {article.excerpt}
          </p>
        )}
        <p className="text-xs text-muted">
          {article.persona.name}
        </p>
      </div>
    </Link>
  );
}
