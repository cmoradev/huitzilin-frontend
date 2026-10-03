# AGENTS.md

## Stack And Entry Points
- Single Angular 22 standalone app (project name `huitzilin-web`, selector prefix `app`, from `angular.json`). Not a monorepo.
- Bootstrap: `src/main.ts` → `appConfig` in `src/app/app.config.ts` → `AppComponent` in `src/app/app.component.ts`. App-level side effects (date-fns locale, decimal.js defaults, MDI icon registration, `AuthService.restoreSession()`) run at module load in `app.component.ts`.
- Top-level routing (`src/app/app.routes.ts`): `authentication/*` → `BlankComponent`; everything else → `FullComponent` with `isAuthGuard` (`canActivate`) and `permissionGuard` (`canActivateChild`); `**` → `/authentication/login`.
- Dashboard feature pages live under `src/app/pages/dashboard/**` and are lazy-loaded via `loadChildren` (`dashboard.routes.ts`) which then uses `loadComponent` per page. `reports` is the only nested `loadChildren` under the dashboard.

## Commands
- `npm install` once after cloning.
- `npm start` — dev server on `http://localhost:4200/` (default `development` config).
- `npm run watch` — dev-mode rebuild on file change.
- `npm run build` — production build (default `production` config). **This is the canonical verification step** — there is no lint or dedicated typecheck script. TypeScript and Angular template-strict errors only surface here.
- `npm test` — runs `ng test` via `@angular/build:unit-test` + Vitest (NOT Jasmine/Karma). Will currently pass with no tests because the repo has no `src/**/*.spec.ts` files; the Vitest wiring already exists in `tsconfig.spec.json` and `angular.json` (`runner: "vitest"`, `vitest/globals` types). Add specs there when needed.
- `npm run generate` — runs `graphql-codegen` via `codegen.ts` using `tsx`.

## Node Version
- There is **no `.nvmrc` and no `engines` field in `package.json`** — claims to the contrary are stale. Angular 22 requires Node 20.19+ or 22.12+; use any current 22.x LTS that satisfies the toolchain.

## GraphQL Workflow
- Operations live in `src/app/graphql/*.graphql`, one file per domain (`auth`, `student`, `enrollment`, `cycle`, `fee`, etc.). Add or edit operations there.
- `src/app/graphql/generated.ts` is generated code; do not hand-edit. Run `npm run generate` after editing any `.graphql` document.
- `codegen.ts` imports `environment.development.ts` and builds the schema URL as `${uri}/graphql`. The `graphql` block in `package.json` is NOT consulted by codegen — only `codegen.ts` matters. If the local API host changes, edit `src/environments/environment.development.ts` (or `codegen.ts` directly).
- Apollo client setup: `src/app/graphql/config-client.ts` provides `provideGraphqlConfig`, wired into `app.config.ts`. It uses `environment.uri` at runtime — so `uri` from the active environment (dev or prod) is the live GraphQL host.

## Environments
- `src/environments/environment.ts` (`production: true`) → live host `https://api-huitzilin.softmora.com.mx`.
- `src/environments/environment.development.ts` (`production: false`) → `http://localhost:4000`. Development DOES switch the API host, unlike the README/AGENTS implied previously. `storageUri` and `storageFolder` are identical in both.
- Selection is driven by Angular's `fileReplacements` in `angular.json`: `development` swaps `environment.ts` for `environment.development.ts`. Default build configuration is `production`; default serve is `development`.

## Path Aliases (tsconfig.json)
Used heavily; do not introduce relative imports when an alias applies.
- `@components/*` → `src/app/components/*` **and** `src/app/layouts/*` (layouts also imported via `@components/...`).
- `@utils/*` → `src/app/utils/*`
- `@services` → `src/app/services` (singular; barrel `index.ts`)
- `@pipes` → `src/app/pipes` (singular; barrel `index.ts`)
- `@routes` → `src/app/routes` (singular)
- `@calculations` → `src/app/lib/calculations` (singular)
- `@guards` → `src/app/guards` (singular)
- `@models` → `src/app/models` (singular)
- `@graphql` → `src/app/graphql/generated.ts` (singular, generated file only)
- `@environment` → `src/environments/environment.ts` (singular; for non-build-time consumers)

## Navigation And Permissions
- Sidebar/navigation metadata is separate from Angular route registration. When adding/renaming a page that should appear in the sidebar or carry permission gating, update both the router config and `src/app/routes/routes-data.ts`. Types live in `src/app/routes/types.ts` (`RouteItem`, `NavigationEnum`, `Entity`, `Action`, `PermissionKey`).
- `permissionGuard` is currently a no-op (returns `true`); real permission checks are TODO. Don't add client-side trust based on it.

## Global State And Persistence
- All cross-feature state goes through `GlobalStateService` (`src/app/services/global-state.service.ts`). It exposes signals + `toObservable` streams and persists to:
  - `sessionStorage`: `session`, `branch`, `cycle`, `period`
  - `localStorage`: `activity`, `enrollment`, `student`
- Do not introduce parallel storage keys. Use the existing signals/services. Note: `branch` setter cascades nulls to `activity`, `enrollment`, `student`, `period`; `student` setter cascades null to `enrollment`.

## App-Wide Defaults
- `date-fns` locale is set to `es` at module load in `src/app/app.component.ts`. Default `Decimal` precision is `14` and rounding is `ROUND_HALF_UP` (also in `app.component.ts`). New code should rely on these globals rather than re-configuring.
- Material's date picker is wired with `provideNativeDateAdapter` (`app.config.ts`), so it uses native JS `Date`, not date-fns formatters.
- `i18n.sourceLocale` is `es` in `angular.json`. New user-facing strings default to Spanish.

## Styles And Assets
- Components default to `scss` via `angular.json` schematics.
- Global styles split across Angular Material theming (`src/styles/material.scss`, with `src/styles/variables.scss` for palette tokens) and Tailwind v4 (`src/styles/tailwind.css`). Tailwind is wired via `.postcssrc.json` with the `@tailwindcss/postcss` plugin.
- The build copies `public/**` and `node_modules/@mdi/angular-material/mdi.svg` → `./assets/mdi.svg`. Material icon registration happens once in `AppComponent` via `MatIconRegistry.addSvgIconSet` against that path.

## CI / Tooling Reality
- No `.github/` workflows, no Husky/pre-commit, no ESLint/Prettier config in-repo. The only verification gate is `npm run build`.
- TypeScript strict mode plus `strictTemplates`, `strictInjectionParameters`, `strictInputAccessModifiers` are enabled in `tsconfig.json` — Angular template type errors are part of `npm run build`.