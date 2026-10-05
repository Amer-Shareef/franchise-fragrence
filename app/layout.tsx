import { Allura, Cormorant_Garamond, Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

const allura = Allura({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-allura",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  title: {
    default: "Franchise Fragrence | A world of scent",
    template: "%s | Franchise Fragrence",
  },
  description:
    "A considered collection of exceptional fragrances, selected for every expression of self.",
  openGraph: {
    type: "website",
    siteName: "Franchise Fragrence",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body
        className={`${allura.variable} ${cormorant.variable} ${inter.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
