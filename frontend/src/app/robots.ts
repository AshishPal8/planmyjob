import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://planmyjob.ashishpal.dev";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/profile", "/dashboard", "/saved-jobs"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
