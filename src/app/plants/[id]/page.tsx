import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PhotoTimelineItem } from "@/components/photo-timeline-item";
import { RefreshReviewButton } from "@/components/refresh-review-button";
import { ReviewCard } from "@/components/review-card";
import { getPlantDetailBundle } from "@/lib/data";
import { formatDate, formatDateTime, riskLabel, scoreClass, statusLabel } from "@/lib/utils";

interface PlantDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PlantDetailPage({ params }: PlantDetailPageProps) {
  const { id } = await params;
  const bundle = await getPlantDetailBundle(id);

  if (!bundle) {
    notFound();
  }

  const {
    plant,
    photos,
    reviews,
    upcomingTasks,
    careLogs,
    milestones,
    latestReviewsByProvider,
    healthReports,
  } = bundle;
  const currentPhoto = photos[0] ?? null;

  return (
    <div className="space-y-5">
      <header className="card overflow-hidden">
        <div className="relative h-64 w-full bg-emerald-100">
          {plant.cover_photo_url ? (
            <Image src={plant.cover_photo_url} alt={plant.nickname} fill className="object-cover" sizes="100vw" />
          ) : (
            <div className="flex h-full items-center justify-center text-center text-sm text-stone-600">
              No cover photo yet
            </div>
          )}
        </div>
        <div className="space-y-3 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-4xl">{plant.nickname}</h1>
              <p className="text-sm text-stone-600">
                {plant.common_name} | {plant.species}
              </p>
            </div>
            <span className={`rounded-full px-4 py-2 text-sm font-semibold ${scoreClass(plant.current_health_score)}`}>
              Health {plant.current_health_score}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-semibold text-stone-700">
            <span className="rounded-full bg-emerald-100 px-2 py-1">{statusLabel(plant.status)}</span>
            <span className="rounded-full bg-stone-100 px-2 py-1">Location: {plant.location}</span>
            <span className="rounded-full bg-stone-100 px-2 py-1">Light: {plant.light_conditions}</span>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <Link
              href={`/plants/${plant.id}/edit`}
              className="rounded-xl border border-emerald-300 px-3 py-2 text-center text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
            >
              Edit Profile
            </Link>
            <Link
              href={`/plants/${plant.id}/photos/new`}
              className="rounded-xl bg-emerald-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Upload New Photo
            </Link>
          </div>
        </div>
      </header>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl">Botanist Agent Review</h2>
          {currentPhoto ? <RefreshReviewButton plantId={plant.id} photoId={currentPhoto.id} /> : null}
        </div>
        <p className="text-sm text-stone-600">
          Latest provider cards shown below. Refresh creates a new timestamped OpenAI, Claude, and consensus review set for the most recent photo.
        </p>
        {!currentPhoto ? (
          <div className="card p-4 text-sm text-stone-600">
            Upload a plant photo before refreshing Botanist Agent reviews.
          </div>
        ) : null}
        <div className="grid gap-3 lg:grid-cols-3">
          <ReviewCard title="OpenAI / ChatGPT Botanist" review={latestReviewsByProvider.openai} />
          <ReviewCard title="Claude Botanist" review={latestReviewsByProvider.anthropic} />
          <ReviewCard title="Consensus Summary" review={latestReviewsByProvider.consensus} />
        </div>
      </section>

      <section className="grid gap-3 lg:grid-cols-2">
        <article className="card p-4">
          <h3 className="text-xl">Care Notes</h3>
          <p className="mt-2 text-sm text-stone-700">
            <span className="font-semibold">Watering:</span> {plant.watering_notes || "No watering notes yet."}
          </p>
          <p className="mt-2 text-sm text-stone-700">
            <span className="font-semibold">Fertilizer:</span> {plant.fertilizer_notes || "No fertilizer notes yet."}
          </p>
          <p className="mt-2 text-sm text-stone-700">
            <span className="font-semibold">Pot / Soil:</span> {plant.soil_notes || "No pot/soil notes yet."}
          </p>
        </article>

        <article className="card p-4">
          <h3 className="text-xl">Upcoming Care Tasks</h3>
          {upcomingTasks.length === 0 ? (
            <p className="mt-2 text-sm text-stone-600">No upcoming care tasks.</p>
          ) : (
            <ul className="mt-2 space-y-2 text-sm text-stone-700">
              {upcomingTasks.map((task) => (
                <li key={task.id} className="rounded-xl bg-emerald-50 px-3 py-2">
                  <p className="font-semibold">{task.title}</p>
                  <p>{task.description}</p>
                  <p className="text-xs text-stone-600">Due {formatDate(task.due_at)}</p>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl">Photo Timeline</h2>
        {photos.length === 0 ? (
          <div className="card p-4 text-sm text-stone-600">No photos yet. Upload the first one to start the timeline.</div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {photos.map((photo) => (
              <PhotoTimelineItem
                key={photo.id}
                plantId={plant.id}
                photo={photo}
                reviews={reviews.filter((review) => review.photo_id === photo.id)}
              />
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-3 lg:grid-cols-2">
        <article className="card p-4">
          <h3 className="text-xl">Health Reports</h3>
          {healthReports.length === 0 ? (
            <p className="mt-2 text-sm text-stone-600">No health reports available yet.</p>
          ) : (
            <ul className="mt-2 space-y-2 text-sm text-stone-700">
              {healthReports.slice(0, 6).map((report) => (
                <li key={report.id} className="rounded-xl bg-stone-100 px-3 py-2">
                  <p className="font-semibold">
                    Score {report.health_score} | {formatDateTime(report.created_at)}
                  </p>
                  <p>{report.summary}</p>
                  <p className="text-xs text-stone-600">
                    Risks: Water {riskLabel(report.watering_risk)}, Pest {riskLabel(report.pest_risk)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className="card p-4">
          <h3 className="text-xl">Care Logs & Milestones</h3>
          <div className="mt-2 space-y-3">
            <div>
              <h4 className="text-base">Recent care logs</h4>
              {careLogs.length === 0 ? (
                <p className="text-sm text-stone-600">No care logs yet.</p>
              ) : (
                <ul className="space-y-2 text-sm text-stone-700">
                  {careLogs.slice(0, 4).map((log) => (
                    <li key={log.id} className="rounded-xl bg-stone-100 px-3 py-2">
                      {log.task_type.replace("_", " ")} | {formatDate(log.completed_at)} | {log.notes}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h4 className="text-base">Milestones</h4>
              {milestones.length === 0 ? (
                <p className="text-sm text-stone-600">No milestones yet.</p>
              ) : (
                <ul className="space-y-2 text-sm text-stone-700">
                  {milestones.slice(0, 4).map((milestone) => (
                    <li key={milestone.id} className="rounded-xl bg-emerald-50 px-3 py-2">
                      <p className="font-semibold">{milestone.title}</p>
                      <p>{milestone.description}</p>
                      <p className="text-xs text-stone-600">{formatDate(milestone.milestone_date)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}