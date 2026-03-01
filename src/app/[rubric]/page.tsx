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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Persona header */}
      <section className="mb-10">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-black text-2xl shrink-0">
            {persona.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-display font-black">
              {persona.rubric_name}
            </h1>
            <p className="text-primary font-medium">{persona.name}</p>
          </div>
        </div>
        {persona.bio && (
          <p className="text-muted leading-relaxed max-w-2xl">{persona.bio}</p>
        )}
      </section>

      {/* Articles */}
      <ArticleGrid articles={articles} />
    </div>
  );
}
