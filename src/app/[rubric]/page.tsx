import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPersonaBySlug, getArticles } from "@/lib/data";
import { ArticleGrid } from "@/components/articles/ArticleGrid";

interface RubricPageProps {
  params: Promise<{ rubric: string }>;
}

export async function generateMetadata({
  params,
}: RubricPageProps): Promise<Metadata> {
  const { rubric } = await params;
  const persona = await getPersonaBySlug(rubric);
  if (!persona) return {};

  return {
    title: `${persona.rubric_name} — ${persona.name}`,
    description: persona.bio ?? `כתבות בנושא ${persona.rubric_name}`,
  };
}

export default async function RubricPage({ params }: RubricPageProps) {
  const { rubric } = await params;
  const persona = await getPersonaBySlug(rubric);

  if (!persona) {
    notFound();
  }

  const articles = await getArticles({ personaId: persona.id, limit: 20 });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Persona header */}
      <section className="mb-12">
        <div className="flex items-start gap-5 mb-5">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-black text-xl shrink-0">
            {persona.name.charAt(0)}
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-primary mb-1">
              {persona.rubric_name}
            </p>
            <h1 className="text-3xl sm:text-4xl font-display font-black leading-[1.1]">
              {persona.name}
            </h1>
          </div>
        </div>
        {persona.bio && (
          <p className="text-muted leading-relaxed max-w-2xl text-[15px]">
            {persona.bio}
          </p>
        )}
        <hr className="editorial-divider-thick mt-8" />
      </section>

      {/* Articles */}
      <ArticleGrid articles={articles} />
    </div>
  );
}
