import posthog from "posthog-js";
import { currentAttribution } from "@/lib/analytics";
import { POSTHOG_EU_UI_HOST, POSTHOG_PROXY_PATH } from "@/lib/posthog-proxy";
import { redactUrlProperties } from "@/lib/redactUrl";

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

// Without a token (e.g. local dev without it in .env.local) analytics stays off.
if (token) {
  posthog.init(token, {
    api_host: POSTHOG_PROXY_PATH,
    ui_host: POSTHOG_EU_UI_HOST,
    defaults: "2026-08-30",
    // No cookies, no local/session storage. PostHog identifies visitors by a hash
    // with a daily salt on its servers, so funnels across pages still work.
    // Requires "Enable cookieless tracking" in the PostHog project settings,
    // otherwise PostHog drops these events.
    cookieless_mode: "always",
    // Nobody is identified, so no person profiles are created.
    person_profiles: "never",
    // Every event, including `$pageview`, carries `ad_version`, `hero_variant` and `utm_*`.
    // The /odhlasit token is removed from every URL first (it links to the lead in the database).
    before_send: (event) => ({
      ...event,
      properties: { ...redactUrlProperties(event.properties), ...currentAttribution() },
    }),
  });
}
