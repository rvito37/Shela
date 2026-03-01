import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Persona } from "@/lib/types";

interface PersonaCardProps {
  persona: Persona;
  variant?: "full" | "compact";
}

export function PersonaCard({ persona, variant = "full" }: PersonaCardProps) {
  return (
    <Link
      href={`/${persona.rubric_slug}`}
      className={cn(
        "group block rounded-xl border border-border bg-surface p-5 hover:shadow-md hover:border-primary/30 transition-all",
        variant === "compact" && "p-4"
      )}
    >
      {/* Avatar placeholder */}
      <div
        className={cn(
          "rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-black mb-3",
          variant === "full" ? "w-16 h-16 text-2xl" : "w-12 h-12 text-xl"
        )}
      >
        {persona.name.charAt(0)}
      </div>

      {/* Name & rubric */}
      <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
        {persona.name}
      </h3>
      <p className="text-sm text-primary/80 font-medium mb-2">
        {persona.rubric_name}
      </p>

      {/* Bio */}
      {variant === "full" && persona.bio && (
        <p className="text-sm text-muted leading-relaxed line-clamp-3">
          {persona.bio}
        </p>
      )}
    </Link>
  );
}
