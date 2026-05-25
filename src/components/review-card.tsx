import type { AiReview } from "@/lib/types";
import { formatDateTime, riskLabel, scoreClass } from "@/lib/utils";

interface ReviewCardProps {
  title: string;
  review: AiReview | undefined;
}

export function ReviewCard({ title, review }: ReviewCardProps) {
  if (!review) {
    return (
      <section className="card p-4">
        <h3 className="text-xl">{title}</h3>
        <p className="mt-2 text-sm text-stone-600">No review yet. Use refresh to generate the first Botanist review.</p>
      </section>
    );
  }

  return (
    <section className="card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-xl">{title}</h3>
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${scoreClass(review.health_score)}`}>
          {review.health_score}/100
        </span>
      </div>

      <div className="mt-3 space-y-2 text-sm text-stone-700">
        <p>
          <span className="font-semibold">Provider:</span> {review.provider} · {review.model_name}
        </p>
        <p>
          <span className="font-semibold">Confidence:</span> {Math.round(review.identification_confidence * 100)}%
        </p>
        <p>
          <span className="font-semibold">Last reviewed:</span> {formatDateTime(review.reviewed_at)}
        </p>
        <p>
          <span className="font-semibold">Summary:</span> {review.visible_condition_summary}
        </p>
        <p>
          <span className="font-semibold">Risks:</span> Water {riskLabel(review.watering_risk)}, Light {riskLabel(review.light_risk)}, Pest {riskLabel(review.pest_risk)}, Disease {riskLabel(review.disease_risk)}
        </p>
        <p>
          <span className="font-semibold">Immediate actions:</span> {review.immediate_actions}
        </p>
      </div>
    </section>
  );
}