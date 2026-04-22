import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE_URL } from "@/lib/utils";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Фитон Крым — натуральная косметика Крыма",
    template: "%s | Фитон Крым",
  },
  description:
    "Фитон Крым — натуральная косметика из крымских трав: бальзамы, мыло ручной работы, бальзамы для губ. Фармакопейные рецептуры с 2009 года.",
  keywords: [
    "Фитон Крым",
    "крымская косметика",
    "натуральные бальзамы",
    "крымское мыло",
    "эфирные масла Крыма",
    "phyton crimea",
  ],
  openGraph: {
    type: "website",
    siteName: "Фитон Крым",
    locale: "ru_RU",
    url: SITE_URL,
    title: "Фитон Крым — натуральная косметика Крыма",
    description:
      "Натуральные бальзамы и мыло ручной работы на крымских травах. С 2009 года.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Фитон Крым",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.svg`,
  description:
    "Производство натуральной косметики в Крыму с 2009 года.",
  address: {
    "@type": "PostalAddress",
    addressCountry: "RU",
    addressRegion: "Республика Крым",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
