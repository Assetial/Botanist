import { NextRequest, NextResponse } from "next/server";
import { createPhoto, uploadPhotoToStorage } from "@/lib/data";
import { requireOwnerSession } from "@/lib/server/owner-session";

export async function POST(request: NextRequest) {
  try {
    // Write protection: uploading photos requires a valid owner session.
    const unauthorizedResponse = await requireOwnerSession(request);
    if (unauthorizedResponse) {
      return unauthorizedResponse;
    }

    const formData = await request.formData();

    const file = formData.get("file");
    const plantId = String(formData.get("plantId") ?? "").trim();
    const notes = String(formData.get("notes") ?? "").trim();
    const takenAtRaw = String(formData.get("takenAt") ?? "").trim();

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Photo file is required." }, { status: 400 });
    }

    if (!plantId) {
      return NextResponse.json({ error: "Plant ID is required." }, { status: 400 });
    }

    const uploaded = await uploadPhotoToStorage(file, plantId);

    const photo = await createPhoto({
      plant_id: plantId,
      image_url: uploaded.imageUrl,
      storage_path: uploaded.storagePath,
      notes: notes || null,
      taken_at: takenAtRaw || null,
    });

    return NextResponse.json({ photo }, { status: 201 });
  } catch (error) {
    void error;
    return NextResponse.json({ error: "Unable to upload photo." }, { status: 500 });
  }
}
