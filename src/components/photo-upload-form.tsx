"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

interface PhotoUploadFormProps {
  plantId: string;
  plantName: string;
}

function canvasToBlob(canvas: HTMLCanvasElement, quality = 0.82): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Image compression failed."));
          return;
        }

        resolve(blob);
      },
      "image/jpeg",
      quality,
    );
  });
}

async function compressImage(file: File): Promise<File> {
  if (file.type.startsWith("image/") === false) {
    return file;
  }

  const bitmap = await createImageBitmap(file);
  const maxWidth = 1600;
  const scale = bitmap.width > maxWidth ? maxWidth / bitmap.width : 1;

  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    return file;
  }

  context.drawImage(bitmap, 0, 0, width, height);
  const compressedBlob = await canvasToBlob(canvas, 0.82);

  return new File([compressedBlob], file.name.replace(/\.(png|webp)$/i, ".jpg"), {
    type: "image/jpeg",
  });
}

export function PhotoUploadForm({ plantId, plantName }: PhotoUploadFormProps) {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [takenAt, setTakenAt] = useState("");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previewUrl = useMemo(() => {
    if (!selectedFile) {
      return null;
    }

    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedFile) {
      setError("Choose a photo first.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const compressedFile = await compressImage(selectedFile);

      const payload = new FormData();
      payload.set("file", compressedFile);
      payload.set("plantId", plantId);
      payload.set("notes", notes);
      payload.set("takenAt", takenAt);

      const response = await fetch("/api/photos/upload", {
        method: "POST",
        body: payload,
      });

      const data = (await response.json()) as { error?: string; photo?: { id: string } };

      if (!response.ok || !data.photo) {
        setError(data.error ?? "Unable to upload photo.");
        return;
      }

      router.push(`/plants/${plantId}/photos/${data.photo.id}`);
      router.refresh();
    } catch {
      setError("Unable to upload photo.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="card space-y-4 p-5" onSubmit={handleSubmit}>
      <p className="text-sm text-stone-600">
        Uploading for <span className="font-semibold text-stone-800">{plantName}</span>. Photo is compressed automatically for free-tier storage savings.
      </p>

      <div>
        <label className="field-label" htmlFor="photo-file">
          Plant Photo
        </label>
        <input
          id="photo-file"
          type="file"
          accept="image/*"
          className="input"
          onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
          required
        />
      </div>

      {previewUrl ? (
        <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-emerald-200">
          <Image src={previewUrl} alt="Preview" fill className="object-cover" unoptimized />
        </div>
      ) : null}

      <div>
        <label className="field-label" htmlFor="taken-at">
          Taken At (optional)
        </label>
        <input
          id="taken-at"
          type="datetime-local"
          className="input"
          value={takenAt}
          onChange={(event) => setTakenAt(event.target.value)}
        />
      </div>

      <div>
        <label className="field-label" htmlFor="photo-notes">
          Notes (optional)
        </label>
        <textarea
          id="photo-notes"
          className="input"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Example: New leaf unfurled after watering."
        />
      </div>

      {error ? <p className="rounded-xl bg-rose-100 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

      <button
        type="submit"
        className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-65"
        disabled={isSaving}
      >
        {isSaving ? "Uploading..." : "Upload Photo"}
      </button>
    </form>
  );
}