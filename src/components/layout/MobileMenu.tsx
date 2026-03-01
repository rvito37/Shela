"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RUBRICS, SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] lg:hidden transition-opacity duration-300",
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      )}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Menu panel */}
      <div
        className={cn(
          "absolute top-0 start-0 h-full w-80 max-w-[85vw] bg-surface shadow-2xl",
          "transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="text-2xl font-display font-black text-primary">
            {SITE_NAME}
          </span>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-accent/30 transition-colors"
            aria-label="סגור"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          <Link
            href="/"
            onClick={onClose}
            className="block px-4 py-3 rounded-lg text-base font-medium hover:bg-accent/30 transition-colors"
          >
            ראשי
          </Link>
          {RUBRICS.map((rubric) => (
            <Link
              key={rubric.slug}
              href={`/${rubric.slug}`}
              onClick={onClose}
              className="block px-4 py-3 rounded-lg text-base font-medium text-foreground/80 hover:text-foreground hover:bg-accent/30 transition-colors"
            >
              <span className="block">{rubric.name}</span>
              <span className="block text-xs text-muted mt-0.5">
                {rubric.persona}
              </span>
            </Link>
          ))}
          <Link
            href="/about"
            onClick={onClose}
            className="block px-4 py-3 rounded-lg text-base font-medium text-foreground/80 hover:text-foreground hover:bg-accent/30 transition-colors"
          >
            אודות
          </Link>
        </nav>
      </div>
    </div>
  );
}
