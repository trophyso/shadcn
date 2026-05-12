import nextCoreWebVitals from "eslint-config-next/core-web-vitals"
import nextTypeScript from "eslint-config-next/typescript"

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "build/**",
      "dist/**",
      "public/**",
      "next-env.d.ts",
      "lib/generated/**",
      ".source/**",
      ".content-collections/**",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    rules: {
      "@next/next/no-duplicate-head": "off",
      // New in eslint-plugin-react-hooks v7; flag common SSR/hydration
      // patterns. Surface them as warnings instead of errors for now.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
      // typescript-eslint v8 promotes this from warn to error in recommended;
      // keep it as warn to match the previous baseline.
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
]

export default eslintConfig
