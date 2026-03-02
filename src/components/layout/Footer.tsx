import Link from "next/link";
import { RUBRICS, SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand */}
          <div className="md:col-span-5">
            <Link
              href="/"
              className="text-2xl font-display font-black text-foreground"
            >
              {SITE_NAME}
            </Link>
            <p className="mt-2 text-sm text-muted leading-relaxed max-w-sm">
              {SITE_TAGLINE}. תרבות, זוגיות, אמהות, יהדות, יופי, קריירה ואוכל
              — עם קולומניסטיות שמדברות אלייך.
            </p>
          </div>

          {/* Rubrics */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-bold tracking-[0.12em] uppercase text-foreground mb-4">
              רובריקות
            </h4>
            <nav className="grid grid-cols-2 gap-x-4 gap-y-2">
              {RUBRICS.map((rubric) => (
                <Link
                  key={rubric.slug}
                  href={`/${rubric.slug}`}
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  {rubric.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Links */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold tracking-[0.12em] uppercase text-foreground mb-4">
              קישורים
            </h4>
            <nav className="space-y-2">
              <Link
                href="/about"
                className="block text-sm text-muted hover:text-foreground transition-colors"
              >
                אודות
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-border text-center">
          <p className="text-xs text-muted">
            © {currentYear} {SITE_NAME}. כל הזכויות שמורות.
          </p>
        </div>
      </div>
    </footer>
  );
}
