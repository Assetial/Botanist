import { PHOTO_BUCKET_DEFAULT } from "@/lib/constants";

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (!value) {
    return fallback;
  }

  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

export function getOwnerPasscode(): string {
  return process.env.BOTANIST_OWNER_PASSCODE?.trim() || "botanist-demo-passcode";
}

export function getOwnerSessionSalt(): string {
  return process.env.BOTANIST_SESSION_SALT?.trim() || "botanist-owner-v1";
}

export function getSupabaseUrl(): string | null {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || null;
}

export function getSupabaseAnonKey(): string | null {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || null;
}

export function getSupabaseServiceRoleKey(): string | null {
  return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || null;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseServiceRoleKey());
}

export function getPhotoBucket(): string {
  return process.env.SUPABASE_PHOTOS_BUCKET?.trim() || PHOTO_BUCKET_DEFAULT;
}

export function isShareEnabled(): boolean {
  return parseBoolean(process.env.BOTANIST_ENABLE_SHARE, false);
}

export function getShareToken(): string {
  return process.env.BOTANIST_SHARE_TOKEN?.trim() || "family-read-only";
}

export function hasOpenAiApiKey(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

export function isRealAiEnabled(): boolean {
  return parseBoolean(process.env.BOTANIST_ENABLE_REAL_AI, false);
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
}
