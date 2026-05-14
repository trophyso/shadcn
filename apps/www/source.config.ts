import { defineConfig, defineDocs, frontmatterSchema } from "fumadocs-mdx/config"
import { z } from "zod"

const docsPageSchema = frontmatterSchema.extend({
  seoTitle: z.string().optional(),
  keywords: z.array(z.string()).optional(),
})

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: docsPageSchema,
  },
})

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  },
})
