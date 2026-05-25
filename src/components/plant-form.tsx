"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { Plant } from "@/lib/types";

interface PlantFormProps {
  mode: "create" | "edit";
  plant?: Plant;
}

interface PlantPayload {
  nickname: string;
  common_name: string;
  species: string;
  location: string;
  light_conditions: string;
  watering_notes: string;
  fertilizer_notes: string;
  soil_notes: string;
  current_health_score: number;
  status: "thriving" | "stable" | "needs-attention";
  is_public: boolean;
}

export function PlantForm({ mode, plant }: PlantFormProps) {
  const router = useRouter();
  const initial = useMemo<PlantPayload>(
    () => ({
      nickname: plant?.nickname ?? "",
      common_name: plant?.common_name ?? "",
      species: plant?.species ?? "",
      location: plant?.location ?? "",
      light_conditions: plant?.light_conditions ?? "Bright indirect",
      watering_notes: plant?.watering_notes ?? "",
      fertilizer_notes: plant?.fertilizer_notes ?? "",
      soil_notes: plant?.soil_notes ?? "",
      current_health_score: plant?.current_health_score ?? 75,
      status: plant?.status ?? "stable",
      is_public: plant?.is_public ?? false,
    }),
    [plant],
  );

  const [values, setValues] = useState(initial);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const endpoint = mode === "create" ? "/api/plants" : `/api/plants/${plant?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = (await response.json()) as { error?: string; plant?: Plant };

      if (!response.ok || !data.plant) {
        setError(data.error ?? "Unable to save plant.");
        return;
      }

      router.push(`/plants/${data.plant.id}`);
      router.refresh();
    } catch {
      setError("Unable to save plant.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="card space-y-4 p-5" onSubmit={onSubmit}>
      <div>
        <label className="field-label" htmlFor="nickname">
          Nickname
        </label>
        <input
          id="nickname"
          className="input"
          value={values.nickname}
          onChange={(event) => setValues((prev) => ({ ...prev, nickname: event.target.value }))}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="common_name">
            Common Name
          </label>
          <input
            id="common_name"
            className="input"
            value={values.common_name}
            onChange={(event) => setValues((prev) => ({ ...prev, common_name: event.target.value }))}
            required
          />
        </div>
        <div>
          <label className="field-label" htmlFor="species">
            Species
          </label>
          <input
            id="species"
            className="input"
            value={values.species}
            onChange={(event) => setValues((prev) => ({ ...prev, species: event.target.value }))}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="location">
            Location
          </label>
          <input
            id="location"
            className="input"
            value={values.location}
            onChange={(event) => setValues((prev) => ({ ...prev, location: event.target.value }))}
            required
          />
        </div>
        <div>
          <label className="field-label" htmlFor="light_conditions">
            Light Conditions
          </label>
          <input
            id="light_conditions"
            className="input"
            value={values.light_conditions}
            onChange={(event) => setValues((prev) => ({ ...prev, light_conditions: event.target.value }))}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="current_health_score">
            Health Score (0-100)
          </label>
          <input
            id="current_health_score"
            className="input"
            type="number"
            min={0}
            max={100}
            value={values.current_health_score}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                current_health_score: Number(event.target.value || "0"),
              }))
            }
          />
        </div>
        <div>
          <label className="field-label" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            className="input"
            value={values.status}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                status: event.target.value as PlantPayload["status"],
              }))
            }
          >
            <option value="thriving">Thriving</option>
            <option value="stable">Stable</option>
            <option value="needs-attention">Needs Attention</option>
          </select>
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="watering_notes">
          Watering Notes
        </label>
        <textarea
          id="watering_notes"
          className="input"
          value={values.watering_notes}
          onChange={(event) => setValues((prev) => ({ ...prev, watering_notes: event.target.value }))}
        />
      </div>

      <div>
        <label className="field-label" htmlFor="fertilizer_notes">
          Fertilizer Notes
        </label>
        <textarea
          id="fertilizer_notes"
          className="input"
          value={values.fertilizer_notes}
          onChange={(event) => setValues((prev) => ({ ...prev, fertilizer_notes: event.target.value }))}
        />
      </div>

      <div>
        <label className="field-label" htmlFor="soil_notes">
          Pot/Soil Notes
        </label>
        <textarea
          id="soil_notes"
          className="input"
          value={values.soil_notes}
          onChange={(event) => setValues((prev) => ({ ...prev, soil_notes: event.target.value }))}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-stone-700">
        <input
          type="checkbox"
          checked={values.is_public}
          onChange={(event) => setValues((prev) => ({ ...prev, is_public: event.target.checked }))}
        />
        Allow this plant in optional read-only share page
      </label>

      {error ? <p className="rounded-xl bg-rose-100 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

      <button
        type="submit"
        className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-65"
        disabled={isSaving}
      >
        {isSaving ? "Saving..." : mode === "create" ? "Create Plant" : "Save Changes"}
      </button>
    </form>
  );
}