import { Metadata } from "next"
import Link from "next/link"
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { HomeComponentMosaic } from "@/components/home-component-mosaic"
import { Button } from "@/registry/trophy/ui/button"
import { siteConfig } from "@/lib/config"

export const dynamic = "force-static";
export const revalidate = false;

export const metadata: Metadata = {
  title: {
    template: `%s | ${siteConfig.title}`,
    default: `${siteConfig.tagline} | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.tagline} | ${siteConfig.title}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.title,
    images: [{ url: siteConfig.ogImage }],
    locale: 'en_US',
    type: 'website',
  },
  metadataBase: new URL(siteConfig.url),
};

export default function IndexPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at center, transparent 0%, transparent 25%, hsl(var(--background) / 0.5) 50%, hsl(var(--background) / 0.8) 70%, hsl(var(--background) / 0.95) 85%, hsl(var(--background)) 95%)",
          }}
        />
        <PageHeader className="relative z-10">
          <PageHeaderHeading className="max-w-4xl">
            <span className="flex items-baseline gap-2 sm:gap-3 font-montserrat">
              <span className="leading-[0.95] font-bold tracking-[-0.03em]">
                Trophy
              </span>
              <span className="font-normal tracking-[-0.02em] opacity-90">
                UI
              </span>
            </span>
          </PageHeaderHeading>
          <PageHeaderDescription>
            {siteConfig.description}
          </PageHeaderDescription>
          <PageActions>
            <Button asChild size="sm">
              <Link href="/docs">Get Started</Link>
            </Button>
            <Button asChild size="sm" variant="ghost">
              <Link href="/docs/components">View Components</Link>
            </Button>
          </PageActions>
        </PageHeader>
        <HomeComponentMosaic />
      </div>
    </div>
  )
}
