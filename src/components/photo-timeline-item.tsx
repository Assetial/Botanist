import Image from "next/image";
import Link from "next/link";
import type { AiReview, PlantPhoto } from "@/lib/types";
import { formatDateTime, scoreClass } from "@/lib/utils";

interface PhotoTimelineItemProps {
  plantId: string;
  photo: PlantPhoto;
  reviews: AiReview[];
}

export function PhotoTimelineItem({ plantId, photo, reviews }: PhotoTimelineItemProps) {
  const latestConsensus = reviews
    .filter((review) => review.provider === "consensus")
    .sort((a, b) => (a.reviewed_at < b.reviewed_at ? 1 : -1))[0];

  return (
    <article className="card overflow-hidden">
      <div className="relative h-56 w-full bg-emerald-100">
        <Image src={photo.image_url} alt="Plant timeline" fill className="object-cover" sizes="100vw" unoptimized={photo.image_url.startsWith("data:")} />
      </div>
      <div className="space-y-2 p-4">
        <p className="text-sm text-stone-600">Uploaded: {formatDateTime(photo.uploaded_at)}</p>
        <p className="text-sm text-stone-700">{photo.notes || "No notes attached."}</p>

        {latestConsensus ? (
          <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2 text-sm">
            <span>Consensus health score</span>
            <span className={`rounded-full px-3 py-1 font-semibold ${scoreClass(latestConsensus.health_score)}`}>
              {latestConsensus.health_score}
            </span>
          </div>
        ) : (
          <p className="rounded-xl bg-stone-100 px-3 py-2 text-sm text-stone-700">No consensus review yet for this photo.</p>
        )}

        <Link
          href={`/plants/${plantId}/photos/${photo.id}`}
          className="inline-flex rounded-xl border border-emerald-300 px-3 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
        >
          View full photo review history
        </Link>
      </div>
    </article>
  );
}