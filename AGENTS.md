<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# BazarDor (বাজার দর)

Bengali market-price app for the B14-A7 assignment. One origin, no database: `https://openapi.programming-hero.com/api/bazardor`. The spec and grading requirements are in `assignment.md` (gitignored — read it directly; requires 8+ meaningful commits, README, BetterAuth, deployment).

## Commands

- `npm run dev` — dev server (Turbopack)
- `npm run build` — production build
- `npm run start` — production server
- `npm run lint` — ESLint 9 flat config (`eslint-config-next` core-web-vitals + TS)
- `npx tsc --noEmit` — no typecheck script exists; this is the only type gate
- Full verification: `npx tsc --noEmit && npm run lint && npm run build`
- No test runner, no CI.

## Stack and layout

- Next.js 16.4.2 App Router, React 19.3, TypeScript strict, Tailwind CSS v4 + daisyUI v5.
- `next.config.ts` enables React Compiler and a Turbopack CSS loader (`*.css` → `@tailwindcss/turbopack`). Tailwind/daisyUI are configured only in `src/app/globals.css` (`@import "tailwindcss"; @plugin "daisyui";`) — there is no `tailwind.config`.
- `src/app/layout.tsx` renders `Header`, `Footer`, and a `max-w-6xl` `<main>` around every page. Page files that add another `<main>` create nested landmarks; prefer a `<div>` wrapper for page content.
- Next 16 passes `params`/`searchParams` as Promises — always `await` them. `LayoutProps<"/">` and similar are generated globals from `.next/types`; run `next dev` or `next build` if they appear missing.

## Copy and numbers

- UI copy is Bengali. Format all prices/numbers with `Intl.NumberFormat("bn-BD")` — do not convert digits by hand.
- API prices (`today`, `change.pct`, market min/max) are numbers. Use `product.change.dir` (`up` / `down` / `flat`) for the change direction.
- Sorting must compare numeric values, never strings (Bengali numerals in C1).

## Data and API

- All data comes from `https://openapi.programming-hero.com/api/bazardor`; there is no database. Endpoints: `/products`, `/products?category=<slug>`, `/products/<id>`, `/categories`.
- Reuse `src/lib/products-api.ts` helpers: `getProducts()`, `getProductsByCategory(slug)`, `getProductById(id)`. `products-api.ts` hardcodes the API base URL and does **not** read `BAZARDOR_API_URL`.
- `/product/[slug]` matches `product.slug`; the API's `/products/:id` expects an ID. The detail page loads all products and finds by slug, so keep links as `/product/${product.slug}`.
- Category pages filter `getProducts()` by `product.category` and derive the heading from the first product. Valid slugs come from `/categories` — don't hardcode them; unknown/empty categories call `notFound()`.
- `product.image` is an emoji (e.g. `🍚`), not a URL. Render it as text; use `next/image` only when the value matches `^https?://`. `next.config.ts` has no `images.remotePatterns`, so remote images need `unoptimized` or a config change.

## Auth

- BetterAuth IS implemented: `src/lib/auth.ts` (server), `src/lib/auth-client.ts` (client), `src/app/api/auth/[...all]/route.ts`, plus `/signin` and `/signup` (server pages rendering `src/components/auth/SignInForm.tsx` / `SignUpForm.tsx` client components). `AuthButtons` shows প্রোফাইল / সাইন আউট when logged in.
- **No `middleware.ts` exists**, but Next 16's renamed `src/proxy.ts` DOES protect `/product/:path*`: unauthenticated visitors are redirected to `/signin?callbackUrl=...`, and the product page re-checks the session server-side as defense-in-depth. Only `/profile` additionally redirects unauthenticated users to `/signin?callbackUrl=/profile` client-side.
- Use `useSession` from `better-auth/react` or `authClient` from `@/lib/auth-client` for session access.
- Social providers (Google/GitHub) need `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`. When missing, social login is gracefully unavailable.
- `.env` is gitignored but required locally. It holds `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, and the OAuth creds. `auth-client.ts` calls `createAuthClient()` with no baseURL, so the browser always talks to its own origin.

## Routes

- `/`, `/category/[slug]` (`?sort=default|price-asc|price-desc`), `/product/[slug]`, `/profile`, `/signin`, `/signup`, plus global `not-found.tsx` and `loading.tsx` skeletons.

## Client components

- `"use client"`: `NavLinks`, `AuthButtons`, `/signin`, `/signup`. All other pages are async Server Components. Add `"use client"` only where hooks/browser APIs are needed.

## Styling

- Mixes daisyUI classes (`card`, `badge`, `table`, theme `light`) with hard-coded greens/hex colors. Match the surrounding section rather than introducing a new palette.

## Assignment and repo hygiene

- `assignment.md` is present locally but gitignored (`/assignment.md`) — read it for requirements.
- The assignment requires at least 8 meaningful commits with clear messages. Currently 3 commits on `main`. Do not squash or rewrite existing history.
- `README.md` is populated — a reasonable secondary source, but `assignment.md` is authoritative for grading.
- Deploy to Vercel, Netlify, Cloudflare Pages, or similar. Dynamic `[slug]` routes must work on refresh after deployment (no hard 404 on reload).
