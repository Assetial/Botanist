# Botanist

Botanist is a private, mobile-first plant care dashboard for two trusted owners.

## What v1.1 includes

- Private plant dashboard
- Plant profiles
- Photo uploads + photo timeline
- Health notes/reports
- Care schedule view
- Botanist Agent review scaffold (OpenAI card, Claude card, consensus card)
- Optional read-only share route

## Tech stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase (database + storage)
- Vercel-ready deployment

## 1) Install dependencies

1. Install [Node.js LTS](https://nodejs.org/).
2. In the project folder, run:

```bash
npm install
```

## 2) Create Supabase project (browser only)

1. Go to [Supabase](https://supabase.com/) and create a project.
2. In Supabase dashboard, open **SQL Editor**.
3. Run `database/schema.sql`.
4. Run `database/seed.sql`.

## 3) Create Storage bucket for photos

1. Open **Storage** in Supabase.
2. Create bucket `plant-photos`.
3. Keep it **Public** for v1 simplicity.

## 4) Add environment variables

1. Copy `.env.example` to `.env.local`.
2. Fill these values:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `BOTANIST_OWNER_PASSCODE`
   - `BOTANIST_SESSION_SALT`
3. Optional share settings:
   - `BOTANIST_ENABLE_SHARE=true`
   - `BOTANIST_SHARE_TOKEN=...`
4. Keep paid AI disabled by default:
   - `BOTANIST_ENABLE_REAL_AI=false`

## 5) Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Privacy and Access in v1

- Botanist is private by default behind a shared owner passcode.
- Photos are publicly readable by direct URL because the Supabase bucket is public.
- Public photo URLs do not allow people to edit or upload.
- Only someone with the owner passcode can add/edit/upload/refresh reviews.
- The optional share page is read-only.
- Do not commit real `.env.local` values to GitHub.

## Claude API Key Setup

- The real Claude key should never be committed to GitHub.
- Locally, add it only to `.env.local`:

```bash
ANTHROPIC_API_KEY=your-new-key-here
```

- On Vercel, add it only in:
  - Project Settings -> Environment Variables -> `ANTHROPIC_API_KEY`
- v1 works without this key because Botanist Agent reviews are mock/demo by default.
- Real Claude analysis should only run when `BOTANIST_ENABLE_REAL_AI=true`.

Botanist Agent in v1 uses mock/demo reviews by default. It does not call OpenAI or Claude unless real AI is explicitly enabled in a future server-side implementation.

## Botanist Agent behavior in v1.1

- `Refresh Botanist Review` creates timestamped review rows for:
  - `openai`
  - `anthropic`
  - `consensus`
- Reviews are saved in `ai_reviews` with provider/model/timestamps and structured fields.
- If `BOTANIST_ENABLE_REAL_AI` is not `true`, review generation stays in mock mode.

## Free-tier photo guidance

- Upload plant photos (not videos).
- Avoid extremely large images.
- Client-side compression/resizing runs before upload in v1.1 to reduce storage and bandwidth usage.

## Deploy to Vercel

1. Push repository to GitHub.
2. Import project in [Vercel](https://vercel.com/).
3. Add all required env vars in Vercel project settings.
4. Deploy.
5. Set `NEXT_PUBLIC_SITE_URL` to your deployed URL.

## Manual QA checklist

See [docs/QA.md](docs/QA.md).

## Security guide

See [SECURITY.md](SECURITY.md).