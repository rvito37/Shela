import type { Metadata } from "next";
import { getPersonas } from "@/lib/data";
import { PersonaCard } from "@/components/personas/PersonaCard";
import { RUBRICS } from "@/lib/constants";
import type { Persona } from "@/lib/types";

export const metadata: Metadata = {
  title: "אודות שלה",
  description:
    "הכירו את הקולומניסטיות של שלה — מגזין דיגיטלי לנשים ישראליות",
};

export default async function AboutPage() {
  let personas: Persona[] = [];
  try {
    personas = await getPersonas();
  } catch {
    // Supabase not configured
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <section className="mb-12">
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary mb-4">
          אודות
        </p>
        <h1 className="text-4xl sm:text-5xl font-display font-black leading-[1.1] mb-6">
          שלה
        </h1>
        <p className="text-lg text-muted leading-relaxed max-w-xl">
          מגזין דיגיטלי לנשים ישראליות. כל רובריקה מנוהלת על ידי כותבת עם קול
          ייחודי וסגנון משלה — כמו מגזין אמיתי, עם קולומניסטיות שמדברות אלייך.
        </p>
        <hr className="editorial-divider-thick mt-10" />
      </section>

      {/* Personas */}
      <section>
        <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-foreground mb-6">
          הקולומניסטיות שלנו
        </h2>

        {personas.length > 0 ? (
          <div>
            {personas.map((persona) => (
              <PersonaCard key={persona.id} persona={persona} />
            ))}
          </div>
        ) : (
          <div className="space-y-0">
            {RUBRICS.map((rubric) => (
              <div
                key={rubric.slug}
                className="flex items-center gap-4 py-5 border-b border-border"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-black text-sm">
                  {rubric.persona.charAt(0)}
                </div>
                <div>
                  <h3 className="font-display font-black">{rubric.persona}</h3>
                  <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-primary">
                    {rubric.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
