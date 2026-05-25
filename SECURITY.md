# SECURITY

## Security model for Botanist v1

Botanist v1 is intended for two trusted owners using a shared passcode.

## Public plant photos in v1

- The plant photo bucket is public in v1 for simplicity.
- Anyone with a direct image URL may view that image.
- This is acceptable in v1 because photos are only of plants.

## Protected actions

The following actions are owner-only:

- Adding plants
- Editing plants
- Uploading photos
- Managing care tasks/logs
- Refreshing Botanist Agent reviews
- Any database writes

## Secrets that must never be committed

- `SUPABASE_SERVICE_ROLE_KEY`
- `BOTANIST_OWNER_PASSCODE`
- `BOTANIST_SESSION_SALT`
- `BOTANIST_SHARE_TOKEN`
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`

## Rotation guidance

Rotate these values if they are shared with anyone who should not have access:

- `BOTANIST_OWNER_PASSCODE`
- `BOTANIST_SESSION_SALT`
- `BOTANIST_SHARE_TOKEN`
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`

## If a secret is accidentally exposed

If an API key or secret is pasted into chat, logs, GitHub, or committed code:

1. Revoke/rotate it immediately.
2. Remove it from deployed environment variables.
3. Add the replacement value only in secure env settings.
4. Redeploy.

## Future privacy upgrade option

If full photo privacy is needed later, switch to private Supabase storage plus signed URLs.