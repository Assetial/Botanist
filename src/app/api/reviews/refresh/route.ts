import { NextRequest, NextResponse } from "next/server";
import { refreshBotanistReviews } from "@/lib/data";
import { requireOwnerSession } from "@/lib/server/owner-session";

export async function POST(request: NextRequest) {
  try {
    // Write protection: refreshing reviews inserts new ai_reviews rows and requires owner session.
    const unauthorizedResponse = await requireOwnerSession(request);
    if (unauthorizedResponse) {
      return unauthorizedResponse;
    }

    const body = (await request.json()) as { plantId?: string; photoId?: string };
    const plantId = body.plantId?.trim();
    const photoId = body.photoId?.trim();

    if (!plantId || !photoId) {
      return NextResponse.json(
        { error: "plantId and photoId are required." },
        { status: 400 },
      );
    }

    const result = await refreshBotanistReviews(plantId, photoId);

    return NextResponse.json({
      mode: result.mode,
      lastReviewedAt: result.reviews[0]?.reviewed_at ?? new Date().toISOString(),
      providers: result.reviews.map((review) => ({
        provider: review.provider,
        modelName: review.model_name,
        confidence: review.identification_confidence,
      })),
      reviews: result.reviews,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Plant not found.") {
        return NextResponse.json({ error: "Plant not found." }, { status: 404 });
      }

      if (error.message === "Photo not found for this plant.") {
        return NextResponse.json(
          { error: "Upload a plant photo before refreshing Botanist Agent reviews." },
          { status: 404 },
        );
      }
    }

    return NextResponse.json({ error: "Unable to refresh reviews." }, { status: 500 });
  }
}
