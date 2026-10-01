import type { MetadataRoute } from "next";
import { publicSiteUrl } from "@/config/brand";
import { robotsRules } from "@/config/indexing";

const SITE_URL = publicSiteUrl();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [robotsRules()],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
