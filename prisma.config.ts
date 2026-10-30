import { loadEnvFile } from "node:process";
import { defineConfig } from "prisma/config";

// Locally the URLs come from .env.local; on Vercel they are already in the environment.
try {
  loadEnvFile(".env.local");
} catch {
  // No .env.local (CI, Vercel).
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // Migrations use the direct (unpooled) connection; the app uses the pooled DATABASE_URL.
  datasource: {
    url: process.env.DIRECT_URL,
  },
});
