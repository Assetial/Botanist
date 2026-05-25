import Link from "next/link";
import { listCareTasks, listDashboardPlantCards } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export default async function CareSchedulePage() {
  const [tasks, cards] = await Promise.all([listCareTasks(), listDashboardPlantCards()]);
  const names = new Map(cards.map((card) => [card.plant.id, card.plant.nickname]));

  return (
    <div className="space-y-4">
      <header className="card p-5">
        <h1 className="text-3xl">Care Schedule</h1>
        <p className="text-sm text-stone-600">
          Watering, fertilizing, rotation, pest checks, and photo reminders.
        </p>
      </header>

      {tasks.length === 0 ? (
        <section className="card p-5 text-sm text-stone-600">
          No upcoming tasks. Add plants and schedule tasks through Supabase or seed data.
        </section>
      ) : (
        <section className="space-y-3">
          {tasks.map((task) => (
            <article key={task.id} className="card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl">{task.title}</h2>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                  {task.task_type.replace("_", " ")}
                </span>
              </div>
              <p className="mt-1 text-sm text-stone-700">{task.description}</p>
              <p className="mt-1 text-sm text-stone-600">Due {formatDate(task.due_at)}</p>
              <p className="mt-1 text-sm text-stone-600">Plant: {names.get(task.plant_id) ?? "Unknown"}</p>
              <div className="mt-3">
                <Link
                  href={`/plants/${task.plant_id}`}
                  className="text-sm font-semibold text-emerald-700 hover:underline"
                >
                  Open plant details
                </Link>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}