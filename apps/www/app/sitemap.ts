import type { MetadataRoute } from "next"

import { siteConfig } from "@/lib/config"
import { source } from "@/lib/source"

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = source.getPages()

  const docEntries: MetadataRoute.Sitemap = pages.map((page) => ({
    url: `${siteConfig.url}${page.url}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: page.url.includes("/components/") ? 0.9 : 0.7,
  }))

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...docEntries,
  ]
}
