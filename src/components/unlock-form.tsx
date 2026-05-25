"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function UnlockForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/";

  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/owner/unlock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ passcode }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Incorrect passcode.");
        return;
      }

      router.push(nextUrl);
      router.refresh();
    } catch {
      setError("Unable to unlock right now.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card mx-auto w-full max-w-md space-y-4 p-6">
      <h1 className="text-3xl">Unlock Botanist</h1>
      <p className="text-sm text-stone-600">
        Enter your shared owner passcode to access private plant pages.
      </p>

      <div>
        <label htmlFor="passcode" className="field-label">
          Shared passcode
        </label>
        <input
          id="passcode"
          type="password"
          className="input"
          autoComplete="current-password"
          value={passcode}
          onChange={(event) => setPasscode(event.target.value)}
          required
        />
      </div>

      {error ? <p className="rounded-xl bg-rose-100 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

      <button
        type="submit"
        className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-65"
        disabled={isLoading}
      >
        {isLoading ? "Unlocking..." : "Unlock"}
      </button>
    </form>
  );
}