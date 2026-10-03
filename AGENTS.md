# AGENTS.md

## Stack And Entry Points
- Single Angular 22 app, not a monorepo. Project name `huitzilin-web`, component selector prefix `app` (from `angular.json`). `src/main.ts` bootstraps a standalone app through `src/app/app.config.ts`.
- Top-level routing lives in `src/app/app.routes.ts`: `authentication/*` uses `BlankComponent`, everything else uses `FullComponent` plus `isAuthGuard` (`canActivate`) and `permissionGuard` (`canActivateChild`).
- Dashboard feature pages live under `src/app/pages/dashboard/**` and are lazy-loaded via `loadChildren` (`dashboard.routes.ts`) which then uses `loadComponent` per page.

## Commands
- Use Node `v22.22.3` (or higher compatible: any 22.x/24.x/26.x release that satisfies Angular's `engines` range) from `.nvmrc` for repo-consistent behavior.
- Install with `npm install`.
- Dev server: `npm start` (defaults to development configuration).
- Production-style verification: `npm run build`. This is the main check — there is no lint or dedicated typecheck script.
- Development watch build: `npm run watch`.
- Regenerate GraphQL client types/services: `npm run generate` (uses `codegen.ts`, runs via `tsx`).

## Verification Reality
- `npm run build` is the canonical verification step; it catches TypeScript, Angular template, and bundling errors.
- `npm test` (`ng test` / Jasmine + Karma) currently fails with `TS18003` because the repo has no `src/**/*.spec.ts` files.
- `angular.json` `test` options also points to `src/styles.scss`, which does not exist (real styles are at `src/styles/material.scss` and `src/styles/tailwind.css`); fix that style path before introducing Karma specs.

## GraphQL Workflow
- Operations live in `src/app/graphql/*.graphql` (one file per domain, e.g. `student.graphql`, `enrollment.graphql`).
- `src/app/graphql/generated.ts` is generated code. Edit the `.graphql` documents, then run `npm run generate`.
- The schema URL is hardcoded to `http://localhost:4000/graphql` in `codegen.ts`. The `graphql` block in `package.json` and the imported `environment.development.ts` are not consulted by codegen; if the local API moves, edit `codegen.ts` directly.
- Apollo client setup is in `src/app/graphql/config-client.ts` and uses `environment.graphqlUri` at runtime.

## Repo Conventions That Are Easy To Miss
- Path aliases in `tsconfig.json` are used heavily. `@components/*` resolves to both `src/app/components/*` and `src/app/layouts/*`, so layout imports also come through `@components/...`. Other aliases: `@utils/*`, `@services`, `@pipes`, `@routes`, `@calculations`, `@guards`, `@models`, `@graphql` (generated only), `@environment`.
- Sidebar/navigation metadata is separate from Angular route registration. When adding or renaming pages, update both the router config and `src/app/routes/routes-data.ts` if the page should appear in navigation or carry permissions (see `RouteItem` / `NavigationEnum` in `src/app/routes/types.ts`).
- Global session, branch, cycle, activity, period, enrollment, and student state is persisted in `GlobalStateService` (`src/app/services/global-state.service.ts`) using `sessionStorage` (session, branch, cycle, period) and `localStorage` (activity, enrollment, student). Avoid introducing parallel storage keys.
- App-wide date and decimal behavior is initialized at module load in `src/app/app.component.ts`: `date-fns` locale is Spanish (`es`) and `decimal.js` uses `precision: 14` and `ROUND_HALF_UP`.
- `i18n.sourceLocale` is `es` in `angular.json`; new user-facing strings should default to Spanish.

## Environments
- `src/environments/environment.ts` (production) and `src/environments/environment.development.ts` differ only by `production: true/false`. Both point to the live `api-huitzilin.softmora.com.mx` endpoints for GraphQL, REST, and storage — "development" only disables build optimizations, it does not switch hosts.

## Styles And Assets
- Components default to `scss` via `angular.json` schematics.
- Global styles are split across Angular Material theming in `src/styles/material.scss` and Tailwind v4 import/theme config in `src/styles/tailwind.css` (Tailwind is wired via `.postcssrc.json` with `@tailwindcss/postcss`).
- The build copies `public/**` and `@mdi/angular-material/mdi.svg` (exposed at `./assets/mdi.svg`); SVG icon registration happens in `AppComponent` via `MatIconRegistry.addSvgIconSet`.