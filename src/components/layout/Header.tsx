"use client";

import { useState } from "react";
import Link from "next/link";
import { RUBRICS, SITE_NAME } from "@/lib/constants";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-surface">
        {/* Top bar — logo centered */}
        <div className="border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14 lg:justify-center relative">
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 -ms-2"
                aria-label="תפריט"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>

              {/* Logo */}
              <Link
                href="/"
                className="text-3xl font-display font-black tracking-tight text-foreground hover:text-primary transition-colors"
              >
                {SITE_NAME}
              </Link>

              {/* Spacer for mobile alignment */}
              <div className="lg:hidden w-10" />
            </div>
          </div>
        </div>

        {/* Navigation bar — desktop */}
        <div className="hidden lg:block border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center justify-center gap-0">
              {RUBRICS.map((rubric) => (
                <Link
                  key={rubric.slug}
                  href={`/${rubric.slug}`}
                  className="px-4 py-3 text-xs font-bold tracking-[0.12em] uppercase text-foreground/70 hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary"
                >
                  {rubric.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
