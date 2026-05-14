// source.config.ts
import { defineConfig, defineDocs, frontmatterSchema } from "fumadocs-mdx/config";
import { z } from "zod";
var docsPageSchema = frontmatterSchema.extend({
  seoTitle: z.string().optional(),
  keywords: z.array(z.string()).optional()
});
var docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: docsPageSchema
  }
});
var source_config_default = defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "github-dark"
      }
    }
  }
});
export {
  source_config_default as default,
  docs
};
