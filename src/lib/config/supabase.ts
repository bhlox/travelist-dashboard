import { createClient } from "@supabase/supabase-js";
import env from "./env";

// Create a single supabase client for interacting with your database
export const supabase = createClient(env.PROJECT_URL, env.PROJECT_KEY);
