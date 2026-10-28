import type { Metadata, Viewport } from "next";
import { Inter, Old_Standard_TT, Ruslan_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { JsonLd } from "@/components/ui/JsonLd";
import { site } from "@/config/site";
import { absoluteUrl, assetUrl } from "@/lib/utils";
import { Providers } from "@/providers";

// Классическая русская книжная антиква — для заголовков, как в брошюре.
const serif = Old_Standard_TT({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

// Узкие «старорусские» буквы — для крупного заголовка, как на обложке.
const display = Ruslan_Display({
  subsets: ["latin", "cyrillic"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(`${site.url}/`),
  title: {
    default: `${site.name} — ${site.title.toLowerCase()}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  icons: { icon: assetUrl("/logo.svg") },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "ru_RU",
    url: absoluteUrl("/"),
    title: `${site.name} — ${site.title.toLowerCase()}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#F4F0EA",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: absoluteUrl("/"),
  logo: absoluteUrl("/logo.svg"),
  foundingDate: String(site.since),
  email: site.contacts.email,
  telephone: site.contacts.phone,
  address: { "@type": "PostalAddress", addressCountry: "RU", addressRegion: site.contacts.region },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${serif.variable} ${display.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col pb-[calc(4rem+env(safe-area-inset-bottom))] font-sans antialiased lg:pb-0">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-brand-green focus:px-4 focus:py-2 focus:text-brand-beige"
        >
          Перейти к содержимому
        </a>
        <JsonLd data={organization} />
        <Providers>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <MobileTabBar />
        </Providers>
      </body>
    </html>
  );
}
