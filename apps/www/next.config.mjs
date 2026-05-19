import { createMDX } from "fumadocs-mdx/next"

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  outputFileTracingIncludes: {
    "/*": ["./registry/**/*", "./content/**/*"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
    ],
  },
  redirects() {
    return [
      {
        source: "/components",
        destination: "/docs/components",
        permanent: true,
      },
    ]
  },
  rewrites() {
    const shadcnAcceptHeader = {
      type: "header",
      key: "accept",
      value: "(.*)application/vnd\\.shadcn\\.v1\\+json(.*)",
    }
    const shadcnUserAgentHeader = {
      type: "header",
      key: "user-agent",
      value: "shadcn",
    }

    return {
      // beforeFiles runs prior to filesystem/static-route matching so shadcn
      // CLI traffic gets the JSON payload while browsers still see the HTML
      // pages from the app router.
      beforeFiles: [
        // Root hosting: serve the registry catalog at `/` so the CLI can do
        // `shadcn add https://ui.trophy.so` and `shadcn init https://ui.trophy.so`.
        {
          source: "/",
          has: [shadcnAcceptHeader],
          destination: "/r/registry.json",
        },
        {
          source: "/",
          has: [shadcnUserAgentHeader],
          destination: "/r/registry.json",
        },
        // Per-component shortcuts: `/<name>` -> `/r/<name>.json` so install
        // commands can drop the `/r/` prefix and `.json` suffix.
        {
          source: "/:name",
          has: [shadcnAcceptHeader],
          destination: "/r/:name.json",
        },
        {
          source: "/:name",
          has: [shadcnUserAgentHeader],
          destination: "/r/:name.json",
        },
      ],
      afterFiles: [
        {
          source: "/docs.md",
          destination: "/llm",
        },
        {
          source: "/docs/:path*.md",
          destination: "/llm/:path*",
        },
      ],
    }
  },
  headers() {
    return [
      // Tell shared caches that responses for `/` and `/<name>` depend on the
      // request headers we negotiate against above.
      {
        source: "/",
        headers: [{ key: "Vary", value: "Accept, User-Agent" }],
      },
      {
        source: "/:name",
        headers: [{ key: "Vary", value: "Accept, User-Agent" }],
      },
    ]
  },
}

const withMDX = createMDX({})

export default withMDX(nextConfig)
