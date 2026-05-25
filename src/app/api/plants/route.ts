import { NextRequest, NextResponse } from "next/server";
import { createPlant } from "@/lib/data";
import { requireOwnerSession } from "@/lib/server/owner-session";

export async function POST(request: NextRequest) {
  try {
    // Write protection: creating plants requires a valid owner session.
    const unauthorizedResponse = await requireOwnerSession(request);
    if (unauthorizedResponse) {
      return unauthorizedResponse;
    }

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

    if (!body.nickname || !body.common_name || !body.species) {
      return NextResponse.json(
        { error: "Nickname, common name, and species are required." },
        { status: 400 },
      );
    }

    const plant = await createPlant(body);
    return NextResponse.json({ plant }, { status: 201 });
  } catch (error) {
    void error;
    return NextResponse.json({ error: "Unable to create plant." }, { status: 500 });
  }
}
