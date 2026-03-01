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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-display font-black mb-4">אודות שלה</h1>
        <p className="text-lg text-muted leading-relaxed max-w-2xl mx-auto">
          שלה הוא מגזין דיגיטלי לנשים ישראליות. כל רובריקה מנוהלת על ידי
          כותבת עם קול ייחודי וסגנון משלה — כמו מגזין אמיתי, עם קולומניסטיות
          שמדברות אלייך.
        </p>
      </section>

      {/* Personas */}
      <section>
        <h2 className="text-2xl font-display font-black mb-6 text-center">
          הקולומניסטיות שלנו
        </h2>

        {personas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {personas.map((persona) => (
              <PersonaCard key={persona.id} persona={persona} />
            ))}
          </div>
        ) : (
          /* Placeholder when Supabase is not connected */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {RUBRICS.map((rubric) => (
              <div
                key={rubric.slug}
                className="rounded-xl border border-border bg-surface p-5"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-black text-xl mb-3">
                  {rubric.persona.charAt(0)}
                </div>
                <h3 className="font-bold text-lg">{rubric.persona}</h3>
                <p className="text-sm text-primary/80 font-medium">
                  {rubric.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
