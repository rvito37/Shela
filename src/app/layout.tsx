import type { Metadata } from "next";
import { Heebo, Assistant } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["latin", "hebrew"],
  display: "swap",
});

const assistant = Assistant({
  variable: "--font-assistant",
  subsets: ["latin", "hebrew"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "שלה | מגזין לנשים ישראליות",
    template: "%s | שלה",
  },
  description:
    "מגזין דיגיטלי לנשים ישראליות — תרבות, זוגיות, אמהות, יהדות, יופי, קריירה ואוכל",
  keywords: [
    "מגזין נשים",
    "ישראל",
    "תרבות",
    "זוגיות",
    "אמהות",
    "יהדות",
    "יופי",
    "אופנה",
    "קריירה",
    "אוכל",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body
        className={`${heebo.variable} ${assistant.variable} font-sans antialiased bg-background text-foreground`}
      >
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
