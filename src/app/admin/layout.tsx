"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "דשבורד", icon: "📊" },
  { href: "/admin/generate", label: "יצירת תוכן", icon: "✨" },
  { href: "/admin/articles", label: "ניהול כתבות", icon: "📝" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [adminKey, setAdminKey] = useState<string | null>(null);
  const [keyInput, setKeyInput] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    const stored = localStorage.getItem("shela-admin-key");
    if (stored) setAdminKey(stored);
  }, []);

  if (!adminKey) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-surface rounded-xl border border-border p-8 w-full max-w-sm">
          <h1 className="text-2xl font-display font-black mb-2 text-center">
            שלה — אדמין
          </h1>
          <p className="text-sm text-muted mb-6 text-center">
            הכניסי את מפתח הניהול
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              localStorage.setItem("shela-admin-key", keyInput);
              setAdminKey(keyInput);
            }}
          >
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="Admin Key"
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
              dir="ltr"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
            >
              כניסה
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin header */}
      <div className="bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-6">
              <Link href="/admin" className="font-display font-black text-lg">
                שלה אדמין
              </Link>
              <nav className="hidden sm:flex items-center gap-1">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-sm transition-colors",
                      pathname === item.href
                        ? "bg-background/20 text-background"
                        : "text-background/60 hover:text-background hover:bg-background/10"
                    )}
                  >
                    <span className="me-1">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="text-xs text-background/50 hover:text-background transition-colors"
              >
                צפה באתר ←
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("shela-admin-key");
                  setAdminKey(null);
                }}
                className="text-xs text-background/50 hover:text-background transition-colors"
              >
                יציאה
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="sm:hidden border-b border-border bg-surface">
        <div className="flex overflow-x-auto px-4 gap-1 py-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm whitespace-nowrap transition-colors",
                pathname === item.href
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted hover:text-foreground"
              )}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </div>
    </div>
  );
}
