import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import env from "@/lib/config/env";

// the setup is this way because when in development mode, we are reaching max client connection everytime a change is made. reference why this is the setup: https://github.com/orgs/supabase/discussions/18986#discussioncomment-8733328
let connection: postgres.Sql;

if (process.env.NODE_ENV === "production") {
  connection = postgres(env.DB_URL, { prepare: false });
} else {
  const globalConnection = global as typeof globalThis & {
    connection: postgres.Sql;
  };

  if (!globalConnection.connection) {
    globalConnection.connection = postgres(env.DB_URL, {
      prepare: false,
    });
  }

  connection = globalConnection.connection;
}
export const db = drizzle(connection, { schema });
