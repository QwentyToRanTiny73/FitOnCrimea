import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/utils";

export const dynamic = "force-static";

// Поисковики читают robots.txt только из корня домена: на github.io/FitOnCrimea
// файл не действует, на собственном домене — заработает.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin/", "/account/"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
