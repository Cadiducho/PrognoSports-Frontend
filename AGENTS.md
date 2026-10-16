# AGENTS.md

Guidance for AI coding agents and human contributors working in this repository.

## Project

PrognoSports Frontend is the web client of [PrognoSports.com](https://prognosports.com): a Vue 3 + TypeScript single-page app built with Vite. It talks to the public REST API (`https://api.prognosports.com/v2`, [Swagger](https://api.prognosports.com/swagger)) provided by the [PrognoSports backend](https://github.com/Cadiducho/PrognoSports). MIT licensed.

The product and its UI are in **Spanish**, and many code comments are too. Keep user-facing strings in Spanish; write new code identifiers in English.

## Commands

Use **pnpm** only (no npm, yarn or Corepack). The pnpm and Node.js versions are pinned in `devEngines` in `package.json`; pnpm downloads them automatically, and CI reads the same field.

```sh
pnpm install --frozen-lockfile   # install exactly what pnpm-lock.yaml says
pnpm dev                         # vite --host, dev server (uses .env.local if present)
pnpm dev:prod                    # dev server with --mode production (.env.production)
pnpm build                       # production build -> dist/
pnpm buildBeta                   # build with --mode beta (beta banner, .env.beta)
pnpm eslint                      # lint src/**
pnpm typecheck                   # vue-tsc --noEmit (Vite does not check types)
```

Corepack does not work with pnpm 12 (its shim fails or pins an older pnpm and `devEngines` is ignored). If `pnpm` complains about the version, run `corepack disable pnpm` and use a pnpm >= 11 installed outside Corepack (see https://pnpm.io/installation).

There is no test suite. ESLint currently reports pre-existing errors, so do not add new ones; check that the count does not grow. `pnpm typecheck` also has pre-existing errors (about 80 at the time of writing); do not add new ones. CI runs lint and typecheck as non-blocking steps.

`pnpm-workspace.yaml` only holds `allowBuilds` (postinstall scripts are denied unless listed, currently `esbuild`). pnpm 12 rejects unknown keys in that file.

## Environments and configuration

Configuration uses Vite modes and `.env` files:

- `.env`: defaults for every mode, pointing at the public API (committed).
- `.env.production`: values for `build` and `dev:prod` (committed).
- `.env.beta`: values for `buildBeta` (committed). beta.prognosports.com is a frontend-only beta and **always uses the production API**; do not point it elsewhere.
- `.env.local`: personal, git-ignored. Copy `.env.local.example` to run `pnpm dev` against a local backend (`VITE_API_BASE_URL=http://localhost:8001/v2`). Vite gives mode files priority over it, so `build`, `buildBeta` and `dev:prod` ignore it.

`VITE_*` variables are inlined into the public bundle: **never put secrets in them**. Types for them live in `src/env.d.ts`; add new variables there. `vite.config.mts` also injects `VITE_GIT_*` build info (shown in the landing footer). The beta banner is driven by `import.meta.env.MODE == 'beta'`.

## Architecture

- **API layer** (`src/_services`): `index.ts` configures a global axios instance. A request interceptor adds the token as the `Authorization` header (the token comes from `authStore` through `setTokenProvider`, wired in `src/session.ts`; services do not import stores); the response interceptor unwraps the API envelope `{success, result}` to `result` and rejects with `{message, status}` (`ApiError`). The API sometimes reports an error with HTTP 200 and the status only in the body, so read `status` from the rejection, not from axios. Each `*.service.ts` is a class, instantiated once and exported from `index.ts` (`seasonService`, `userService`, ...). Add new endpoints there, not with ad-hoc axios calls in components. `api.ts` has `getObject`, `getObjectList` and `postObject`, which take an endpoint plus the entity's `mapX` function and return the domain type.
- **Routing** (`src/_router`): `routes.ts` groups lazy-loaded pages under three layouts (`LandingLayout`, `PrognoLayout`, `EmptyRoutedLayout`). `index.ts` registers global `beforeEach` guards from `middleware/` in a significant order: `data` (loads user and community) -> `auth` -> `verified` -> `community` -> `admin` -> `home`. Later guards rely on state set by `data`.
- **State** (`src/store`): Pinia options-style stores (auth, community, app, theme, toast). `authStore` owns the logged-in user and token. The user is loaded once (`authStore.loadUser()`, shared between concurrent callers) and not on every navigation: after changing the user's own data call `authStore.loadUser(true)`, which updates the same object so components holding it see the change. `user` is `null` when logged out; use `authStore.requireUser()` in code that only runs on `requiresAuth` routes and `authStore.loggedUser` (nullable) where there may be no session. `src/session.ts` handles an expired session: on a 401 it checks `/user/me` (a 401 is also returned for a wrong password, so it does not mean the session expired) and only signs out if the token is rejected; it also revalidates the user when the tab becomes visible after 5 minutes. `communityStore` owns the current community.
- **Server data** (`src/queries`, Pinia Colada): data read from the API that several screens show goes through `useQuery` instead of `onMounted` + a manual `isLoading`. Queries and mutations live in `src/queries/<entity>.ts`; the query functions are the existing `*Service` methods. Keys start with the entity root (`COMMUNITIES_KEY`), and a query whose result depends on the logged-in user includes the user id in its key. After a change made from the app, a mutation invalidates the entity root in `onSettled`, so every list in use refreshes on its own (this replaces the old mitt `reload*` events; mitt stays for UI-only events). Use `isPending` for the first load; background refreshes do not show a spinner. `data` is shared by every component using the same key, so never mutate it in place: copy it (`[...data.value]`) before sorting or editing. Global defaults (`staleTime`) are in `src/main.ts`; request errors are typed as `ApiError` (`src/queries/colada.d.ts`). A screen with a season selector uses `useSeasonSelection()` (`src/composables`), which returns the cached list and the chosen season; the choice is made once and a later refresh of the list does not change it. A form that edits an object in place must not edit the query data: load it with the service into a local copy. Communities and the season list have been migrated so far; other screens still load with `onMounted`.
- **Domain models** (`src/types`): plain interfaces, not classes. Each entity that needs conversion has an `XDto` (the JSON as the API returns it, dates as strings), the `X` interface and a `mapX(dto)` function that builds it (dates become `Date`, nested entities go through their own mapper). Behaviour that used to be methods lives in pure functions in `src/utils/<entity>.ts` (`isUserAdmin(user)`, `grandPrixLink(gp)`, ...); use a composable (`use*`) only for logic with reactive state or lifecycle. Types must not import from `@/_services`: `BASE_URL` is in `src/config.ts`. Keep UI state (a chosen file, an edit flag) in the component, not in the model.
- **UI**: `src/components/lib` holds the in-house `P*` primitives and form/table helpers; feature components sit in sibling folders. `src/pages/admin/**` is the CRUD back-office.
- **Styling**: Tailwind 3 (custom palette in `tailwind.config.mjs`, `darkMode: 'class'`) coexists with Bulma 0.9 + the Oruga Bulma theme (`src/scss/app.scss`). Bulma is being phased out (hence `cssMinify: 'esbuild'` in `vite.config.mts`), so prefer Tailwind for new UI. Oruga components are registered globally, which is why `vue/no-undef-components` is disabled.
- `@` aliases `src/`.

## Conventions

- Vue SFCs with TypeScript. Follow the ESLint config: `defineOptions, defineModel, defineProps, defineEmits, defineSlots` macro order, typed `ref`s, no root `v-if`.
- `.editorconfig`: 2-space indent, UTF-8, final newline.

## Branching and CI

- Open PRs against `develop`. A PR runs `.github/workflows/requests.yml` (lint + beta build).
- Push to `develop` deploys to beta; push to `master` deploys to production (`deploy*.yml`). Both reuse `.github/workflows/vite.yml`.
- Workflow actions are pinned by commit SHA; Dependabot keeps them updated.
- Deploys upload `dist/` with the local composite action `.github/actions/rsync-deploy` (rsync over SSH, so the server needs `rsync` installed).
