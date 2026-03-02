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
        "group block border-b border-border py-6 hover:bg-surface-alt transition-colors -mx-4 px-4",
        variant === "compact" && "py-4"
      )}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div
          className={cn(
            "rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-black shrink-0",
            variant === "full" ? "w-14 h-14 text-xl" : "w-10 h-10 text-base"
          )}
        >
          {persona.name.charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          {/* Rubric label */}
          <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-primary mb-1">
            {persona.rubric_name}
          </p>

          {/* Name */}
          <h3 className="font-display font-black text-lg group-hover:text-primary transition-colors">
            {persona.name}
          </h3>

          {/* Bio */}
          {variant === "full" && persona.bio && (
            <p className="text-sm text-muted leading-relaxed mt-1 line-clamp-2">
              {persona.bio}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
