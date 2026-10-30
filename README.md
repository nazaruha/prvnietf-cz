This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Analytics (PostHog Cloud EU)

- **Cookieless setup, IP discarded; no consent banner, to be confirmed by whoever handles GDPR.** That last part is a legal judgment, not a fact from PostHog's docs.
- `cookieless_mode: "always"`: PostHog stores nothing in cookies or local/session storage. It recognises a visitor by a hash of IP, browser and a salt that changes daily and is then deleted, so the same visitor keeps one ID across pages for a day and funnels work. Trade-offs: unique visitors beyond one day are inflated, there is no country map (no GeoIP) and no session replay.
- `person_profiles: "never"`: nobody is identified, and the email from the form is never sent to PostHog.
- Every event carries `ad_version`, `hero_variant` and `utm_*` (added in `before_send`). A full page load forgets everything, so redirects keep `v` and `utm_*` in the URL via `withAttribution()` from `src/lib/attribution.ts`.
- Funnel: `$pageview` → `picker_q1` → `picker_q2` → `result_shown` → `form_viewed` → `form_started` → `form_submitted` → `pdf_downloaded`, sent with `track()` from `src/lib/analytics.ts`.
- Events go through our own domain at `/r9t` (rewrites in `next.config.ts`), so ad blockers don't drop them. If a `middleware.ts`/`proxy.ts` is added, its matcher must not catch `/r9t`.

**Setup:** set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` in Vercel and `.env.local` (without it, analytics is off). In the PostHog project settings, turn on **Enable cookieless tracking** (otherwise PostHog drops the events) and **Discard client IP data**.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
