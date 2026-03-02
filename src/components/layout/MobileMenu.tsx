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
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          "absolute top-0 start-0 h-full w-80 max-w-[85vw] bg-white shadow-xl",
          "transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-14 border-b border-border">
          <span className="text-xl font-display font-black">
            {SITE_NAME}
          </span>
          <button
            onClick={onClose}
            className="p-2 -me-2"
            aria-label="סגור"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="py-4">
          <Link
            href="/"
            onClick={onClose}
            className="block px-5 py-3 text-sm font-bold tracking-[0.1em] uppercase text-foreground hover:text-primary transition-colors"
          >
            ראשי
          </Link>

          <hr className="editorial-divider mx-5 my-2" />

          {RUBRICS.map((rubric) => (
            <Link
              key={rubric.slug}
              href={`/${rubric.slug}`}
              onClick={onClose}
              className="block px-5 py-3 text-sm font-bold tracking-[0.1em] uppercase text-foreground/80 hover:text-primary transition-colors"
            >
              {rubric.name}
            </Link>
          ))}

          <hr className="editorial-divider mx-5 my-2" />

          <Link
            href="/about"
            onClick={onClose}
            className="block px-5 py-3 text-sm font-bold tracking-[0.1em] uppercase text-foreground/80 hover:text-primary transition-colors"
          >
            אודות
          </Link>
        </nav>
      </div>
    </div>
  );
}
