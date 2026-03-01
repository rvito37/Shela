import Link from "next/link";
import { RUBRICS, SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background/90 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-display font-black text-accent mb-3">
              {SITE_NAME}
            </h3>
            <p className="text-sm text-background/60 leading-relaxed">
              {SITE_TAGLINE}. תרבות, זוגיות, אמהות, יהדות, יופי, קריירה ואוכל
              — עם קולומניסטיות שמדברות אלייך.
            </p>
          </div>

          {/* Rubrics */}
          <div>
            <h4 className="font-bold text-background/80 mb-3">רובריקות</h4>
            <nav className="space-y-2">
              {RUBRICS.map((rubric) => (
                <Link
                  key={rubric.slug}
                  href={`/${rubric.slug}`}
                  className="block text-sm text-background/50 hover:text-accent transition-colors"
                >
                  {rubric.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* About */}
          <div>
            <h4 className="font-bold text-background/80 mb-3">קישורים</h4>
            <nav className="space-y-2">
              <Link
                href="/about"
                className="block text-sm text-background/50 hover:text-accent transition-colors"
              >
                אודות
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-background/10 text-center text-sm text-background/40">
          <p>
            © {currentYear} {SITE_NAME}. כל הזכויות שמורות.
          </p>
        </div>
      </div>
    </footer>
  );
}
