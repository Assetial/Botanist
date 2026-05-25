import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
  isSupabaseConfigured,
} from "@/lib/env";

let cachedAdminClient: SupabaseClient | null = null;

export function getSupabaseAdminClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (cachedAdminClient) {
    return cachedAdminClient;
  }

  const url = getSupabaseUrl();
  const serviceRole = getSupabaseServiceRoleKey();

  if (!url || !serviceRole) {
    return null;
  }

  cachedAdminClient = createClient(url, serviceRole, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return cachedAdminClient;
}