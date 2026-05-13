import { Metadata } from "next"
import Link from "next/link"

import { siteConfig } from "@/lib/config"
import { HomeComponentMosaic } from "@/components/home-component-mosaic"
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Button } from "@/registry/trophy/ui/button"

export const dynamic = "force-static"
export const revalidate = false

export const metadata: Metadata = {
  title: {
    template: `%s | ${siteConfig.title}`,
    default: `${siteConfig.tagline} | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  openGraph: {
    title: `${siteConfig.tagline} | ${siteConfig.title}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.title,
    images: [{ url: siteConfig.ogImage }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.tagline} | ${siteConfig.title}`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  alternates: {
    canonical: siteConfig.url,
  },
  metadataBase: new URL(siteConfig.url),
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Trophy UI",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  description: siteConfig.description,
  url: siteConfig.url,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  keywords:
    "gamification UI components, React gamification, streak component, achievement component, leaderboard component, points component, shadcn gamification, Tailwind CSS gamification",
}

export default function IndexPage() {
  return (
    <div className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
            <span className="font-montserrat flex items-baseline gap-2 sm:gap-3">
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
      <section className="container-wrapper">
        <div className="container mx-auto max-w-3xl px-4 py-12 text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Gamification UI Components for React
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-base sm:text-lg">
            Trophy UI gives you production-ready gamification components — streak
            trackers, achievement badges, leaderboards, points displays, and
            more. Built on{" "}
            <Link href="https://ui.shadcn.com" className="underline">
              shadcn/ui
            </Link>{" "}
            and Tailwind CSS, every component is open source, fully
            customizable, and installs with a single CLI command into any React
            or Next.js project.
          </p>
        </div>
      </section>
    </div>
  )
}
