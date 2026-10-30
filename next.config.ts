import type { NextConfig } from "next";
import {
  POSTHOG_EU_API_HOST,
  POSTHOG_EU_ASSETS_HOST,
  POSTHOG_PROXY_PATH,
} from "./src/lib/posthog-proxy";

const nextConfig: NextConfig = {
  // PostHog reverse proxy. The static and array rules must come before the catch-all.
  async rewrites() {
    return [
      {
        source: `${POSTHOG_PROXY_PATH}/static/:path*`,
        destination: `${POSTHOG_EU_ASSETS_HOST}/static/:path*`,
      },
      {
        source: `${POSTHOG_PROXY_PATH}/array/:path*`,
        destination: `${POSTHOG_EU_ASSETS_HOST}/array/:path*`,
      },
      {
        source: `${POSTHOG_PROXY_PATH}/:path*`,
        destination: `${POSTHOG_EU_API_HOST}/:path*`,
      },
    ];
  },
  // PostHog API paths end with a slash (/e/, /flags/); without this each request gets a 308.
  skipTrailingSlashRedirect: true,
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
