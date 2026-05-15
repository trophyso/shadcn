# Contributing to Gamification UI Kit by Trophy

Thank you for helping improve [Gamification UI Kit by Trophy](https://ui.trophy.so). This document explains how to set up the repo locally, run the site and tooling, and what we look for in contributions.

## Prerequisites

- **Node.js** 18 or later (see the [README](./README.md))
- **pnpm** 9 — the repo pins the version in `packageManager`. Enable it with [Corepack](https://nodejs.org/api/corepack.html):

  ```bash
  corepack enable
  ```

## Getting started

From the repository root:

```bash
pnpm install
pnpm dev
```

`pnpm dev` runs the [Turborepo](https://turbo.build/) dev graph. The docs and component showcase live in the `www` app (Next.js on port 3000 by default).

Other useful root scripts:

| Command | Purpose |
| --- | --- |
| `pnpm build` | Production build across workspaces |
| `pnpm check` | Lint, typecheck, and Prettier check (good pre-PR sanity pass) |
| `pnpm lint` / `pnpm lint:fix` | ESLint |
| `pnpm typecheck` | TypeScript (`tsc --noEmit`) |
| `pnpm format:check` / `pnpm format:write` | Prettier |

## Working on components and the registry

Registry sources and generated artifacts live under `apps/www/registry/`. When you change registry entries or related scripts, rebuild from the **repository root**:

```bash
pnpm registry:build
```

That runs the `www` registry build, then applies lint fixes and formatting so generated files stay consistent.

Documentation and examples for components typically live under `apps/www/content/docs/` (MDX) and `apps/www/components/` as needed. Follow existing patterns for new components or doc pages.

## Pull requests

- **Scope**: Keep changes focused on one concern when possible (easier review and safer merges).
- **Quality**: Run `pnpm check` (or at least lint, typecheck, and format) before you open a PR.
- **Describe the change**: In the PR description, briefly note what changed and why, especially for user-visible or registry-facing updates.

If you are unsure whether an idea fits the project, open an issue or draft PR and we can align on approach before you invest too much time.

## License

By contributing, you agree that your contributions will be licensed under the same terms as the project (see [LICENSE](./LICENSE.md)).
