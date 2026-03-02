import Link from "next/link";
import Image from "next/image";
import type { ArticleWithPersona } from "@/lib/types";

interface FeaturedArticleProps {
  article: ArticleWithPersona;
}

export function FeaturedArticle({ article }: FeaturedArticleProps) {
  const href = `/${article.persona.rubric_slug}/${article.slug}`;

  return (
    <Link href={href} className="group block">
      <div className="relative overflow-hidden">
        {/* Image */}
        {article.cover_image_url && (
          <div className="relative aspect-[16/9] sm:aspect-[2/1]">
            <Image
              src={article.cover_image_url}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
              sizes="100vw"
              priority
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </div>
        )}

        {/* Content overlay */}
        <div className="absolute bottom-0 start-0 end-0 p-6 sm:p-10">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/80 mb-3">
            {article.persona.rubric_name}
          </p>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display font-black leading-[1.1] text-white mb-3 max-w-3xl">
            {article.title}
          </h2>
          {article.excerpt && (
            <p className="text-sm sm:text-base text-white/70 line-clamp-2 max-w-2xl mb-3">
              {article.excerpt}
            </p>
          )}
          <p className="text-xs text-white/50">
            {article.persona.name}
          </p>
        </div>
      </div>
    </Link>
  );
}
