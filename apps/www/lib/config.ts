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
  tagline: "Open Source gamification components",
  description:
    "A collection of Open Source gamification components that you can customize, extend, and build on.",
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
};

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};
