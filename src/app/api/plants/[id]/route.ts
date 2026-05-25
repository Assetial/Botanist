import { NextRequest, NextResponse } from "next/server";
import { updatePlant } from "@/lib/data";
import { requireOwnerSession } from "@/lib/server/owner-session";

interface Context {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, context: Context) {
  try {
    // Write protection: editing plants requires a valid owner session.
    const unauthorizedResponse = await requireOwnerSession(request);
    if (unauthorizedResponse) {
      return unauthorizedResponse;
    }

    const { id } = await context.params;

    const body = (await request.json()) as {
      nickname: string;
      common_name: string;
      species: string;
      location: string;
      light_conditions: string;
      watering_notes: string;
      fertilizer_notes: string;
      soil_notes: string;
      current_health_score?: number;
      status?: "thriving" | "stable" | "needs-attention";
      is_public?: boolean;
      cover_photo_url?: string | null;
    };

    const plant = await updatePlant(id, body);

    if (!plant) {
      return NextResponse.json({ error: "Plant not found." }, { status: 404 });
    }

    return NextResponse.json({ plant });
  } catch (error) {
    void error;
    return NextResponse.json({ error: "Unable to update plant." }, { status: 500 });
  }
}
