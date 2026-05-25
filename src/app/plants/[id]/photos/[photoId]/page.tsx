import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RefreshReviewButton } from "@/components/refresh-review-button";
import { getPhotoDetail } from "@/lib/data";
import { formatDateTime, riskLabel, scoreClass } from "@/lib/utils";

interface PhotoDetailPageProps {
  params: Promise<{ id: string; photoId: string }>;
}

export default async function PhotoDetailPage({ params }: PhotoDetailPageProps) {
  const { id, photoId } = await params;
  const data = await getPhotoDetail(id, photoId);

  if (!data) {
    notFound();
  }

  const { plant, photo, reviews } = data;
  const takenAtLabel = formatDateTime(photo.taken_at || photo.uploaded_at);

  return (
    <div className="space-y-5">
      <header className="card space-y-2 p-5">
        <Link href={`/plants/${plant.id}`} className="text-sm font-semibold text-emerald-700 hover:underline">
          Back to {plant.nickname}
        </Link>
        <h1 className="text-3xl">Photo Review History</h1>
        <p className="text-sm text-stone-600">
          Uploaded {formatDateTime(photo.uploaded_at)} | Taken {takenAtLabel}
          {photo.taken_at ? "" : " (fallback to upload time)"}
        </p>
        <p className="text-sm text-stone-700">{photo.notes || "No photo notes saved."}</p>
      </header>

      <section className="card overflow-hidden">
        <div className="relative h-72 w-full bg-emerald-100">
          <Image
            src={photo.image_url}
            alt={`${plant.nickname} photo`}
            fill
            className="object-cover"
            unoptimized={photo.image_url.startsWith("data:")}
            sizes="100vw"
          />
        </div>
        <div className="p-4">
          <RefreshReviewButton plantId={plant.id} photoId={photo.id} />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl">Botanist Agent Review Timeline</h2>
        {reviews.length === 0 ? (
          <div className="card p-5 text-sm text-stone-600">
            No reviews yet. Use refresh to generate OpenAI, Claude, and consensus cards.
          </div>
        ) : (
          reviews.map((review) => (
            <article key={review.id} className="card space-y-2 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg capitalize">
                  {review.provider} | {review.model_name}
                </h3>
                <span className={`rounded-full px-3 py-1 text-sm font-semibold ${scoreClass(review.health_score)}`}>
                  {review.health_score}/100
                </span>
              </div>
              <p className="text-sm text-stone-600">Reviewed {formatDateTime(review.reviewed_at)}</p>
              <p className="text-sm text-stone-700">{review.visible_condition_summary}</p>
              <p className="text-sm text-stone-700">
                <span className="font-semibold">Confidence:</span> {Math.round(review.identification_confidence * 100)}% |{" "}
                <span className="font-semibold">Plant:</span> {review.plant_identification}
              </p>
              <p className="text-sm text-stone-700">
                <span className="font-semibold">Risks:</span> Water {riskLabel(review.watering_risk)}, Light {riskLabel(review.light_risk)}, Pest {riskLabel(review.pest_risk)}, Disease {riskLabel(review.disease_risk)}
              </p>
              <p className="text-sm text-stone-700">
                <span className="font-semibold">Immediate actions:</span> {review.immediate_actions}
              </p>
            </article>
          ))
        )}
      </section>
    </div>
  );
}