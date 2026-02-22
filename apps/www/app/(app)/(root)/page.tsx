import { Metadata } from "next"
import Link from "next/link"

import { siteConfig } from "@/lib/config"
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Button } from "@/registry/trophy/ui/button"

const title = "Trophy UI"
const description =
  "A collection of Open Source gamification components that you can customize and extend."

export const dynamic = "force-static"
export const revalidate = false

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          title
        )}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          title
        )}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
}

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
            <span className="flex items-baseline gap-2 sm:gap-3">
              <span className="leading-[0.95] font-bold tracking-[-0.03em]">
                Trophy
              </span>
              <span className="font-normal tracking-[-0.02em] opacity-90">
                UI
              </span>
            </span>
          </PageHeaderHeading>
          <PageHeaderDescription>{description}</PageHeaderDescription>
          <PageActions>
            <Button asChild size="sm">
              <Link href="/docs">Get Started</Link>
            </Button>
            <Button asChild size="sm" variant="ghost">
              <Link href="/docs/components">View Components</Link>
            </Button>
          </PageActions>
        </PageHeader>
      </div>
      <div className="container-wrapper section-soft flex-1 pb-6">
        <div className="container overflow-hidden">
          <section className="py-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Gamification Components</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Streaks, achievements, leaderboards, and points — all the components you need 
              to build engaging gamification experiences. Built on top of{" "}
              <a href="https://ui.shadcn.com" className="underline underline-offset-4" target="_blank" rel="noreferrer">
                shadcn/ui
              </a>{" "}
              and designed to work with the{" "}
              <a href="https://trophy.so" className="underline underline-offset-4" target="_blank" rel="noreferrer">
                Trophy API
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
