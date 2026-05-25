"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface RefreshReviewButtonProps {
  plantId: string;
  photoId: string;
  disabled?: boolean;
}

export function RefreshReviewButton({ plantId, photoId, disabled = false }: RefreshReviewButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleRefresh() {
    try {
      setIsLoading(true);
      setMessage(null);

      const response = await fetch("/api/reviews/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plantId, photoId }),
      });

      const data = (await response.json()) as { error?: string; mode?: string; lastReviewedAt?: string };

      if (!response.ok) {
        setMessage(data.error ?? "Unable to refresh right now.");
        return;
      }

      setMessage(
        `Refreshed (${data.mode ?? "mock"}) at ${data.lastReviewedAt ? new Date(data.lastReviewedAt).toLocaleTimeString() : "just now"}`,
      );
      router.refresh();
    } catch {
      setMessage("Unable to refresh right now.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleRefresh}
        disabled={disabled || isLoading}
        className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-55"
      >
        {isLoading ? "Refreshing..." : "Refresh Botanist Review"}
      </button>
      {message ? <p className="text-xs text-stone-600">{message}</p> : null}
    </div>
  );
}