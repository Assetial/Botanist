import type { AiReview, Plant, PlantPhoto, RiskLevel, ReviewProvider } from "@/lib/types";

const providerModels: Record<ReviewProvider, string> = {
  openai: "mock-openai-botanist-v1",
  anthropic: "mock-claude-botanist-v1",
  consensus: "mock-consensus-v1",
  manual: "manual-entry",
};

const riskLevels: RiskLevel[] = ["low", "medium", "high"];

function hashSeed(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) % 100000;
  }
  return hash;
}

function scoreFromSeed(seed: number, min: number, max: number): number {
  const range = max - min;
  return min + (seed % (range + 1));
}

function pickRisk(seed: number): RiskLevel {
  return riskLevels[seed % riskLevels.length];
}

function clampConfidence(value: number): number {
  return Math.round(Math.min(0.99, Math.max(0.55, value)) * 100) / 100;
}

function buildBaseReview(
  provider: Exclude<ReviewProvider, "consensus" | "manual">,
  plant: Plant,
  photo: PlantPhoto,
  reviewedAt: string,
): AiReview {
  const seed = hashSeed(`${provider}:${plant.id}:${photo.id}:${reviewedAt}`);
  const healthScore = scoreFromSeed(seed, 66, 95);

  return {
    id: crypto.randomUUID(),
    plant_id: plant.id,
    photo_id: photo.id,
    provider,
    model_name: providerModels[provider],
    plant_identification: plant.species,
    identification_confidence: clampConfidence(0.72 + (seed % 20) / 100),
    alternate_identifications: provider === "openai" ? `${plant.common_name} variant` : null,
    visible_condition_summary:
      provider === "openai"
        ? "Leaf posture and color are generally strong with minor dry patches."
        : "Structure appears healthy with slight edge curl on lower leaves.",
    health_score: healthScore,
    watering_risk: pickRisk(seed + 2),
    light_risk: pickRisk(seed + 3),
    pest_risk: pickRisk(seed + 4),
    disease_risk: pickRisk(seed + 5),
    immediate_actions:
      provider === "openai"
        ? "Check topsoil moisture and water if top layer is dry."
        : "Inspect lower leaves and maintain consistent watering rhythm.",
    daily_care: "Check leaf firmness and moisture before bedtime.",
    weekly_care: "Rotate plant and inspect undersides of leaves.",
    monthly_care: "Inspect roots and tidy away damaged foliage.",
    long_term_care: "Track monthly growth with the same camera angle.",
    warning_signs: "Rapid yellowing, soft stem, or spotting on multiple leaves.",
    next_photo_recommended_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    raw_response: `Mock ${provider} review generated without paid API keys.`,
    reviewed_at: reviewedAt,
    created_at: reviewedAt,
  };
}

function buildConsensusReview(openai: AiReview, anthropic: AiReview, reviewedAt: string): AiReview {
  const averageHealth = Math.round((openai.health_score + anthropic.health_score) / 2);

  const confidence = clampConfidence(
    (openai.identification_confidence + anthropic.identification_confidence) / 2,
  );

  return {
    id: crypto.randomUUID(),
    plant_id: openai.plant_id,
    photo_id: openai.photo_id,
    provider: "consensus",
    model_name: providerModels.consensus,
    plant_identification: openai.plant_identification,
    identification_confidence: confidence,
    alternate_identifications: openai.alternate_identifications || anthropic.alternate_identifications,
    visible_condition_summary:
      "Consensus: both providers agree plant appears stable with manageable risk factors.",
    health_score: averageHealth,
    watering_risk: openai.watering_risk === anthropic.watering_risk ? openai.watering_risk : "medium",
    light_risk: openai.light_risk === anthropic.light_risk ? openai.light_risk : "medium",
    pest_risk: openai.pest_risk === anthropic.pest_risk ? openai.pest_risk : "low",
    disease_risk: openai.disease_risk === anthropic.disease_risk ? openai.disease_risk : "low",
    immediate_actions: "Follow the next watering window and take another photo in one week.",
    daily_care: "Observe leaf firmness and avoid abrupt location changes.",
    weekly_care: "Rotate plant and inspect for early pest signs.",
    monthly_care: "Evaluate drainage and soil compaction.",
    long_term_care: "Keep consistent timeline photos to compare growth.",
    warning_signs: "Fast spread of discoloration or prolonged droop.",
    next_photo_recommended_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    raw_response: "Consensus synthesized from mock OpenAI and Anthropic provider results.",
    reviewed_at: reviewedAt,
    created_at: reviewedAt,
  };
}

export function generateMockReviewSet(plant: Plant, photo: PlantPhoto): AiReview[] {
  const reviewedAt = new Date().toISOString();
  const openai = buildBaseReview("openai", plant, photo, reviewedAt);
  const anthropic = buildBaseReview("anthropic", plant, photo, reviewedAt);
  const consensus = buildConsensusReview(openai, anthropic, reviewedAt);
  return [openai, anthropic, consensus];
}