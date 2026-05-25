export const OWNER_COOKIE_NAME = "botanist_owner_token";
export const OWNER_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 14;
export const PHOTO_BUCKET_DEFAULT = "plant-photos";
export const SHARE_PATH_PREFIX = "/share";

export const PRIVATE_PAGE_PREFIXES = [
  "/",
  "/plants",
  "/care",
];

export const PRIVATE_API_PREFIXES = [
  "/api/plants",
  "/api/photos",
  "/api/reviews",
  "/api/care",
  "/api/care-tasks",
  "/api/care-logs",
  "/api/milestones",
];

export const PUBLIC_BYPASS_PATHS = [
  "/owner/unlock",
  "/api/owner/unlock",
  "/favicon.ico",
];
