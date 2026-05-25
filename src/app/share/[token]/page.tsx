import Image from "next/image";
import { notFound } from "next/navigation";
import { listPublicMilestones, listSharePlants } from "@/lib/data";
import { getShareToken, isShareEnabled } from "@/lib/env";
import { formatDate } from "@/lib/utils";

interface SharePageProps {
  params: Promise<{ token: string }>;
}

export default async function SharePage({ params }: SharePageProps) {
  const { token } = await params;

  if (!isShareEnabled()) {
    return (
      <div className="card mx-auto max-w-2xl space-y-3 p-6 text-center">
        <h1 className="text-3xl">Share view is disabled</h1>
        <p className="text-sm text-stone-600">
          The owner kept sharing off for privacy. Set `BOTANIST_ENABLE_SHARE=true` to enable read-only sharing.
        </p>
      </div>
    );
  }

  if (token !== getShareToken()) {
    notFound();
  }

  const [cards, milestones] = await Promise.all([listSharePlants(), listPublicMilestones()]);

  return (
    <div className="space-y-5">
      <header className="card space-y-3 p-5">
        <h1 className="text-4xl">Family and Friends Plant View</h1>
        <p className="text-sm text-stone-600">
          Read-only gallery. Private owner notes are hidden.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <article key={card.plant.id} className="card overflow-hidden">
            <div className="relative h-44 w-full bg-emerald-100">
              {card.plant.cover_photo_url ? (
                <Image src={card.plant.cover_photo_url} alt={card.plant.nickname} fill className="object-cover" sizes="100vw" />
              ) : (
                <div className="flex h-full items-center justify-center text-center text-sm text-stone-600">
                  No photo
                </div>
              )}
            </div>
            <div className="space-y-2 p-4">
              <h2 className="text-2xl">{card.plant.nickname}</h2>
              <p className="text-sm text-stone-600">{card.plant.common_name}</p>
              <p className="text-sm text-stone-700">
                Latest health snapshot: {card.latestConsensusReview ? `${card.latestConsensusReview.health_score}/100` : "Pending"}
              </p>
              <p className="text-xs text-stone-600">Last photo: {formatDate(card.latestPhotoDate)}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="card p-5">
        <h2 className="text-2xl">Plant Stories and Milestones</h2>
        {milestones.length === 0 ? (
          <p className="mt-2 text-sm text-stone-600">No public milestones yet.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {milestones.slice(0, 12).map((milestone) => (
              <li key={milestone.id} className="rounded-xl bg-emerald-50 p-3">
                <p className="font-semibold text-stone-800">{milestone.title}</p>
                <p className="text-sm text-stone-700">{milestone.description}</p>
                <p className="text-xs text-stone-600">{formatDate(milestone.milestone_date)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}