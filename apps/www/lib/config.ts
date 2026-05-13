function siteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (fromEnv && /^https?:\/\//i.test(fromEnv)) {
    return fromEnv.replace(/\/$/, "")
  }
  return "https://ui.trophy.so"
}

export const siteConfig = {
  name: "Trophy UI",
  url: siteOrigin(),
  ogImage: `${siteOrigin()}/og.jpg`,
  title: "Trophy UI",
  tagline: "Open-source gamification UI components for React",
  description:
    "Trophy UI is an open-source library of gamification UI components built on shadcn/ui and Tailwind CSS. Drop-in React components for streaks, achievements, leaderboards, points, and more — ready to copy and customize.",
  keywords: [
    "gamification UI components",
    "gamification React components",
    "streak UI component",
    "achievement UI component",
    "leaderboard UI component",
    "points UI component",
    "gamification design system",
    "React gamification library",
    "shadcn gamification",
    "Tailwind CSS gamification",
    "user engagement components",
    "open source gamification",
    "gamification toolkit",
    "streak tracker React",
    "leaderboard React component",
    "achievement badge React",
    "points system UI",
    "gamification UX",
    "Trophy UI",
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

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
}
