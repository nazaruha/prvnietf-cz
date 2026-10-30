import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

// Variable font (weights 200–800). latin-ext carries the Czech letters (ř, ě, ů).
// The optical size axis keeps large headlines tight and small text readable.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
});

// Title and description from docs/copy.md ("Meta").
const title = "Které ETF koupit jako první? Srovnání pro investory z Česka";
const description =
  "Odpovězte na 2 otázky a uvidíte ETF, které se k vám hodí – s poplatky, daněmi a tím, co čekat po nákupu. Zdarma, bez registrace.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.prvnietf.cz"),
  title,
  description,
  openGraph: {
    title,
    description,
    locale: "cs_CZ",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="cs" className={`${bricolage.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
