# Botanist v1.1 Manual QA Checklist

- [ ] App loads with missing Supabase env vars and shows setup guidance.
- [ ] App loads with Supabase env vars and seed data.
- [ ] Locked user can view allowed read-only pages.
- [ ] Locked user cannot access add/edit/upload/care/review actions.
- [ ] Owner can unlock with passcode.
- [ ] Owner can add/edit plants.
- [ ] Owner can upload a photo.
- [ ] Photo timeline shows uploaded timestamp.
- [ ] Owner can refresh mock Botanist Agent reviews.
- [ ] OpenAI, Claude, and consensus mock cards appear.
- [ ] Share page is read-only.
- [ ] No real secret values are committed.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.