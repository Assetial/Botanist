import Link from "next/link";
import { PlantCard } from "@/components/plant-card";
import { getShareToken, isRealAiEnabled, isShareEnabled } from "@/lib/env";
import { hasSupabaseConfig, listDashboardPlantCards } from "@/lib/data";
import { hasAnthropicApiKeyConfigured } from "@/lib/server/anthropic";

export default async function DashboardPage() {
  const cards = await listDashboardPlantCards();
  const shareEnabled = isShareEnabled();
  const supabaseReady = hasSupabaseConfig();
  const realAiEnabled = isRealAiEnabled();
  const anthKeyConfigured = hasAnthropicApiKeyConfigured();

  return (
    <div className="space-y-6">
      <section className="card space-y-4 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl">Plant Dashboard</h1>
            <p className="text-sm text-stone-600">
              Private-by-default tracking for your two-person plant routine.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/plants/new"
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Add Plant
            </Link>
            <Link
              href="/care"
              className="rounded-xl border border-emerald-300 px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
            >
              Care Schedule
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className={`rounded-full px-3 py-1 ${supabaseReady ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
            {supabaseReady ? "Supabase Connected" : "Supabase Not Configured (Mock Data Active)"}
          </span>
          <span
            className={`rounded-full px-3 py-1 ${shareEnabled ? "bg-sky-100 text-sky-800" : "bg-stone-200 text-stone-700"}`}
          >
            {shareEnabled ? "Read-only share enabled" : "Read-only share disabled"}
          </span>
          {shareEnabled ? (
            <Link
              href={`/share/${getShareToken()}`}
              className="rounded-full bg-sky-50 px-3 py-1 text-sky-700 underline-offset-2 hover:underline"
            >
              Open share view
            </Link>
          ) : null}
          <span
            className={`rounded-full px-3 py-1 ${realAiEnabled && anthKeyConfigured ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}
          >
            Botanist Agent mode: {realAiEnabled && anthKeyConfigured ? "real-ai-ready (mock output in v1.1)" : "mock"}
          </span>
        </div>
      </section>

      {!supabaseReady ? (
        <section className="card space-y-2 p-5">
          <h2 className="text-2xl">Setup Guidance</h2>
          <p className="text-sm text-stone-700">
            Botanist is running in demo mode because Supabase environment variables are missing.
          </p>
          <p className="text-sm text-stone-700">
            Add your Supabase values in `.env.local`, then run `database/schema.sql` and `database/seed.sql`.
          </p>
        </section>
      ) : null}

      {cards.length === 0 ? (
        <section className="card p-8 text-center">
          <h2 className="text-2xl">No plants yet</h2>
          <p className="mt-2 text-sm text-stone-600">
            Start by adding your first plant profile.
          </p>
          <div className="mt-4">
            <Link
              href="/plants/new"
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Add first plant
            </Link>
          </div>
        </section>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <PlantCard key={card.plant.id} card={card} />
          ))}
        </section>
      )}
    </div>
  );
}
