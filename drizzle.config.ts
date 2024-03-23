import { cwd } from "node:process";
import { type Config } from "drizzle-kit";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(cwd());

if (!process.env.DB_URL) {
  throw new Error("DB_URL env value is missing");
}

export default {
  out: "./src/db/migrations",
  schema: "./src/db/schema.ts",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DB_URL,
  },
  verbose: true,
  strict: true,
} satisfies Config;
