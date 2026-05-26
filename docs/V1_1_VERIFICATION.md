# Botanist v1.1 Verification Guide

This guide provides a fast, repeatable checklist for verifying key Botanist v1.1 flows in local development.

## Prerequisites

- Node.js 20+ recommended
- npm 10+ recommended
- A `.env.local` configured for your local backend services if needed for your setup

## 1) Install dependencies

From repository root:

```bash
npm install
```

Expected result: install completes without errors.

## 2) Run lint

```bash
npm run lint
```

Expected result: ESLint exits successfully with no warnings/errors.

## 3) Run production build

```bash
npm run build
```

Expected result: Next.js build completes successfully.

## 4) Start app locally

```bash
npm run dev
```

Open: `http://localhost:3000`

Expected result: home/dashboard routes load without runtime errors in terminal or browser console.

## 5) Check locked vs unlocked owner state

1. Navigate to the owner unlock route (for example, from app navigation or `/owner/unlock`).
2. Confirm **locked owner state**: owner-only edit actions should be unavailable before unlock.
3. Enter the owner unlock flow and complete unlock.
4. Confirm **unlocked owner state**: owner-only actions (such as edit/add flows) become available.

Expected result: UI clearly reflects lock state before/after unlock.

## 6) Check dashboard loads

1. Open the main dashboard/home route (`/`).
2. Confirm plant list/cards render.
3. Confirm no fatal API or render errors appear.

Expected result: dashboard is usable and displays plant content.

## 7) Check plant detail pages

1. Open at least one plant detail route (`/plants/:id`).
2. Confirm plant metadata/details load.
3. If owner is unlocked, verify edit/navigation controls render as expected.

Expected result: detail page loads consistently and links are functional.

## 8) Check photo upload flow

1. Navigate to a plant photo add route (for example `/plants/:id/photos/new`) while owner is unlocked.
2. Upload a valid image.
3. Save/submit upload.
4. Return to plant detail/photo list and confirm image appears.

Expected result: upload completes and new photo is visible for that plant.

## 9) Check photo timestamps

1. After upload, inspect the displayed timestamp/date for the new photo.
2. Verify timestamp is present and in expected format/timezone behavior for your UI.
3. Refresh page and confirm timestamp persists.

Expected result: timestamps render consistently and do not disappear after refresh.

## 10) Check “Refresh Botanist Review” mock flow

1. On a plant detail page, trigger **Refresh Botanist Review**.
2. Wait for refresh completion UI.
3. Confirm review cards update/render using current mock/demo review behavior.

Expected result: refresh interaction completes without errors and review content remains available.

## 11) Check OpenAI / Claude / consensus review cards

1. On plant detail, locate model review cards:
   - OpenAI review card
   - Claude review card
   - Consensus/combined review card
2. Confirm all cards render with expected headings/content regions.
3. Confirm no card crashes when refresh is triggered.

Expected result: all three review surfaces are visible and stable in v1.1 demo mode.

## 12) Check share page is read-only

### Default behavior (share disabled)

1. Run with `BOTANIST_ENABLE_SHARE=false` (default behavior in v1.1).
2. Open the configured share route.
3. Confirm the UI shows a "Share view is disabled" style message.

Expected result: disabled-share messaging is expected by default and should **not** be treated as a test failure.

### Enabled share behavior

1. Set `BOTANIST_ENABLE_SHARE=true`.
2. Set `BOTANIST_SHARE_TOKEN` to a known local test token.
3. Open the configured tokenized share route using that token (implemented here as `/share/:token`; other deployments may use a different tokenized share URL).
4. Confirm plant information is viewable.
5. Confirm owner-only edit/create/upload/review actions are not available on share view.

Expected result: share page supports read-only viewing only when share mode is enabled and a valid tokenized route is used.

## 13) Confirm real AI is disabled by default

1. Run local app with default project configuration.
2. Trigger review refresh flow.
3. Verify behavior remains mock/demo unless explicit real-AI enablement work is added in a future release.

Expected result: no dependency on live AI provider calls in default v1.1 verification flow.

---

## Expected v1.1 behavior

- Core plant dashboard/detail/share flows load reliably in local development.
- Owner lock/unlock gating controls write/edit capabilities.
- Photo uploads complete and timestamps display/persist.
- Botanist review refresh and model cards function in mock/demo mode by default.
- Lint and build succeed in a clean local environment.

## Known v1 limitations

- AI reviews are mock/demo unless real AI is enabled later.
- Public photo bucket means images are public by direct URL.
- No full user accounts yet.
- No Google Calendar/Drive/MCP integration yet.
