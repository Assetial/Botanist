import { NextRequest, NextResponse } from "next/server";
import { refreshMockReviews } from "@/lib/data";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { plantId?: string; photoId?: string };
    const plantId = body.plantId?.trim();
    const photoId = body.photoId?.trim();

    if (!plantId || !photoId) {
      return NextResponse.json(
        { error: "plantId and photoId are required." },
        { status: 400 },
      );
    }

    const result = await refreshMockReviews(plantId, photoId);

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
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to refresh reviews." },
      { status: 500 },
    );
  }
}