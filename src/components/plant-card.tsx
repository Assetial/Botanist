import Image from "next/image";
import Link from "next/link";
import type { DashboardPlantCard } from "@/lib/types";
import { formatDate, scoreClass, statusLabel } from "@/lib/utils";

interface PlantCardProps {
  card: DashboardPlantCard;
}

export function PlantCard({ card }: PlantCardProps) {
  const { plant, latestPhotoDate, nextTask, latestConsensusReview } = card;

  return (
    <article className="card overflow-hidden">
      <div className="relative h-44 w-full bg-emerald-100">
        {plant.cover_photo_url ? (
          <Image src={plant.cover_photo_url} alt={plant.nickname} fill className="object-cover" sizes="100vw" />
        ) : (
          <div className="flex h-full items-center justify-center bg-emerald-100 text-4xl">??</div>
        )}
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl leading-tight">{plant.nickname}</h2>
            <p className="text-sm text-stone-600">{plant.common_name}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-sm font-semibold ${scoreClass(plant.current_health_score)}`}>
            {plant.current_health_score}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-semibold text-stone-700">
          <span className="rounded-full bg-stone-100 px-2 py-1">{statusLabel(plant.status)}</span>
          <span className="rounded-full bg-emerald-100 px-2 py-1">
            Last photo: {formatDate(latestPhotoDate)}
          </span>
        </div>

        <div className="space-y-1 text-sm text-stone-700">
          <p>
            Next care: {nextTask ? `${nextTask.title} (${formatDate(nextTask.due_at)})` : "No task scheduled"}
          </p>
          <p>
            Latest Botanist consensus: {latestConsensusReview ? `${latestConsensusReview.health_score}/100` : "No review yet"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <Link
            href={`/plants/${plant.id}`}
            className="rounded-xl bg-emerald-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-emerald-700"
          >
            View Plant
          </Link>
          <Link
            href={`/plants/${plant.id}/photos/new`}
            className="rounded-xl border border-emerald-300 px-3 py-2 text-center text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
          >
            Upload Photo
          </Link>
        </div>
      </div>
    </article>
  );
}