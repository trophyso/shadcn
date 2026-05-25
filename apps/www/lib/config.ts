function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (fromEnv && /^https?:\/\//i.test(fromEnv)) {
    return fromEnv.replace(/\/$/, "")
  }
  return "https://ui.trophy.so"
}

export const siteConfig = {
  name: "Gamification UI Kit by Trophy",
  url: siteOrigin(),
  ogImage: `${siteOrigin()}/og.png`,
  title: "Gamification UI Kit by Trophy",
  description:
    "Trophy's Gamification UI Kit is an open-source library of gamification UI components built on shadcn/ui and Tailwind CSS. Drop-in React components for streaks, achievements, leaderboards, points, and more — ready to copy and customize.",
  keywords: [
    "gamification UI kit",
    "gamification UI components",
    "gamification component library",
    "gamification React components",
    "Next.js gamification",
    "streak UI component",
    "achievement UI component",
    "leaderboard UI component",
    "points UI component",
    "gamification design system",
    "React gamification library",
    "shadcn gamification",
    "shadcn registry",
    "Tailwind CSS gamification",
    "Tailwind gamification components",
    "user engagement components",
    "open source gamification",
    "open source gamification UI",
    "free gamification components",
    "gamification toolkit",
    "streak tracker React",
    "leaderboard React component",
    "achievement badge React",
    "points system UI",
    "gamification UX"
  ],
  links: {
    github: "https://github.com/trophyso/ui",
  },
  navItems: [
    {
      href: "/docs",
      label: "Docs",
    },
    {
      href: "/docs/components",
      label: "Components",
    },
  ],
}

export const gaMeasurementId =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || undefined

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
}
