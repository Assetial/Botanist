# Botanist

Botanist is a private, mobile-first plant care web app for two people.

It includes:
- Private plant dashboard
- Plant profile pages
- Photo uploads + timeline
- Health notes/reports
- Care schedules
- Botanist Agent Review scaffold (OpenAI card + Claude card + consensus card)
- Optional read-only family/friends share page

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase (database + storage)
- Vercel-ready deployment

## 1) Install Dependencies

1. Install [Node.js LTS](https://nodejs.org/).
2. In the project folder, run:

```bash
npm install
```

## 2) Create a Supabase Project (Browser Only)

1. Go to [Supabase](https://supabase.com/) and create a new project.
2. Wait until the project is ready.
3. In Supabase dashboard, open **SQL Editor**.
4. Open local file `database/schema.sql`, copy all text, paste into SQL Editor, and run it.
5. Open local file `database/seed.sql`, copy all text, paste into SQL Editor, and run it.

## 3) Create Storage Bucket for Photos

1. In Supabase dashboard, open **Storage**.
2. Create a bucket named `plant-photos`.
3. Set it to **Public** for easy image display in v1.

## 4) Add Environment Variables

1. Copy `.env.example` to `.env.local`.
2. Fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `BOTANIST_OWNER_PASSCODE`
   - `BOTANIST_SESSION_SALT`
3. Optional share setup:
   - Set `BOTANIST_ENABLE_SHARE=true`
   - Choose `BOTANIST_SHARE_TOKEN`
4. Optional future AI keys (not required for v1):
   - `OPENAI_API_KEY`
   - `ANTHROPIC_API_KEY`

## 5) Run Locally

```bash
npm run dev
```

Open: [http://localhost:3000](http://localhost:3000)

You will see an unlock screen first. Enter your shared passcode.

## 6) How AI Review Works in v1

- `Refresh Botanist Review` creates mock timestamped reviews for:
  - `openai`
  - `anthropic`
  - `consensus`
- No paid API key is required for this v1 behavior.
- Review rows are saved in `ai_reviews` so history is preserved.

## 7) Deploy to Vercel

1. Push this repo to GitHub.
2. Go to [Vercel](https://vercel.com/) and import the repo.
3. In Vercel project settings, add the same environment variables from `.env.local`.
4. Deploy.
5. After deploy, set `NEXT_PUBLIC_SITE_URL` to your Vercel URL.

## 8) Beginner Notes

- If Supabase is not configured yet, the app still opens with mock demo data.
- All core pages are private by default behind the shared passcode.
- Share route is read-only and optional.

## Project Files

- `database/schema.sql` - database schema
- `database/seed.sql` - demo data
- `.env.example` - required environment variables
- `TODO.md` - future roadmap items