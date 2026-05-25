import {
  getPhotoBucket,
  isRealAiEnabled,
  isSupabaseConfigured,
} from "@/lib/env";
import { getMemoryStore } from "@/lib/store";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { generateMockReviewSet } from "@/lib/review-generator";
import { getAnthropicApiKey, hasAnthropicApiKeyConfigured } from "@/lib/server/anthropic";
import type {
  AiReview,
  CareLog,
  CareTask,
  DashboardPlantCard,
  HealthReport,
  Milestone,
  Plant,
  PlantDetailBundle,
  PlantPhoto,
  ReviewProvider,
} from "@/lib/types";

export interface PlantFormInput {
  nickname: string;
  common_name: string;
  species: string;
  location: string;
  light_conditions: string;
  watering_notes: string;
  fertilizer_notes: string;
  soil_notes: string;
  status?: Plant["status"];
  current_health_score?: number;
  is_public?: boolean;
  cover_photo_url?: string | null;
}

export interface PhotoInput {
  plant_id: string;
  image_url: string;
  storage_path?: string | null;
  notes?: string | null;
  taken_at?: string | null;
}

function normalizePlantInput(input: PlantFormInput): PlantFormInput {
  return {
    ...input,
    status: input.status ?? "stable",
    current_health_score: input.current_health_score ?? 75,
    is_public: input.is_public ?? false,
    cover_photo_url: input.cover_photo_url ?? null,
  };
}

function pickLatestReviewByProvider(reviews: AiReview[]): Partial<Record<ReviewProvider, AiReview>> {
  const latest: Partial<Record<ReviewProvider, AiReview>> = {};

  for (const review of reviews) {
    if (!latest[review.provider]) {
      latest[review.provider] = review;
      continue;
    }

    const prev = latest[review.provider];
    if (prev && new Date(review.reviewed_at).getTime() > new Date(prev.reviewed_at).getTime()) {
      latest[review.provider] = review;
    }
  }

  return latest;
}

export async function listDashboardPlantCards(): Promise<DashboardPlantCard[]> {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    const store = getMemoryStore();
    return store.plants
      .map((plant) => {
        const photos = store.photos
          .filter((photo) => photo.plant_id === plant.id)
          .sort((a, b) => (a.uploaded_at < b.uploaded_at ? 1 : -1));

        const nextTask = store.careTasks
          .filter((task) => task.plant_id === plant.id && !task.completed_at)
          .sort((a, b) => (a.due_at > b.due_at ? 1 : -1))[0] ?? null;

        const latestConsensus = store.aiReviews
          .filter((review) => review.plant_id === plant.id && review.provider === "consensus")
          .sort((a, b) => (a.reviewed_at < b.reviewed_at ? 1 : -1))[0] ?? null;

        return {
          plant,
          latestPhotoDate: photos[0]?.uploaded_at ?? null,
          nextTask,
          latestConsensusReview: latestConsensus,
        };
      })
      .sort((a, b) => (a.plant.updated_at < b.plant.updated_at ? 1 : -1));
  }

  const plantsResult = await supabase.from("plants").select("*").order("updated_at", { ascending: false });
  if (plantsResult.error) {
    throw new Error(plantsResult.error.message);
  }

  const plants = (plantsResult.data ?? []) as Plant[];
  if (plants.length === 0) {
    return [];
  }

  const plantIds = plants.map((plant) => plant.id);

  const [photosResult, tasksResult, reviewsResult] = await Promise.all([
    supabase
      .from("plant_photos")
      .select("*")
      .in("plant_id", plantIds)
      .order("uploaded_at", { ascending: false }),
    supabase
      .from("care_tasks")
      .select("*")
      .in("plant_id", plantIds)
      .is("completed_at", null)
      .order("due_at", { ascending: true }),
    supabase
      .from("ai_reviews")
      .select("*")
      .in("plant_id", plantIds)
      .eq("provider", "consensus")
      .order("reviewed_at", { ascending: false }),
  ]);

  if (photosResult.error) {
    throw new Error(photosResult.error.message);
  }

  if (tasksResult.error) {
    throw new Error(tasksResult.error.message);
  }

  if (reviewsResult.error) {
    throw new Error(reviewsResult.error.message);
  }

  const photos = (photosResult.data ?? []) as PlantPhoto[];
  const tasks = (tasksResult.data ?? []) as CareTask[];
  const reviews = (reviewsResult.data ?? []) as AiReview[];

  return plants.map((plant) => {
    const latestPhoto = photos.find((photo) => photo.plant_id === plant.id) ?? null;
    const nextTask = tasks.find((task) => task.plant_id === plant.id) ?? null;
    const latestConsensusReview = reviews.find((review) => review.plant_id === plant.id) ?? null;

    return {
      plant,
      latestPhotoDate: latestPhoto?.uploaded_at ?? null,
      nextTask,
      latestConsensusReview,
    };
  });
}

export async function getPlantById(plantId: string): Promise<Plant | null> {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return getMemoryStore().plants.find((plant) => plant.id === plantId) ?? null;
  }

  const result = await supabase.from("plants").select("*").eq("id", plantId).maybeSingle();
  if (result.error) {
    throw new Error(result.error.message);
  }

  return (result.data as Plant | null) ?? null;
}

export async function getPlantDetailBundle(plantId: string): Promise<PlantDetailBundle | null> {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    const store = getMemoryStore();
    const plant = store.plants.find((item) => item.id === plantId);

    if (!plant) {
      return null;
    }

    const photos = store.photos
      .filter((photo) => photo.plant_id === plantId)
      .sort((a, b) => (a.uploaded_at < b.uploaded_at ? 1 : -1));

    const upcomingTasks = store.careTasks
      .filter((task) => task.plant_id === plantId && !task.completed_at)
      .sort((a, b) => (a.due_at > b.due_at ? 1 : -1));

    const careLogs = store.careLogs
      .filter((log) => log.plant_id === plantId)
      .sort((a, b) => (a.completed_at < b.completed_at ? 1 : -1));

    const milestones = store.milestones
      .filter((milestone) => milestone.plant_id === plantId)
      .sort((a, b) => (a.milestone_date < b.milestone_date ? 1 : -1));

    const healthReports = store.healthReports
      .filter((report) => report.plant_id === plantId)
      .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

    const latestReviewsByProvider = pickLatestReviewByProvider(
      store.aiReviews.filter((review) => review.plant_id === plantId),
    );
    const reviews = store.aiReviews
      .filter((review) => review.plant_id === plantId)
      .sort((a, b) => (a.reviewed_at < b.reviewed_at ? 1 : -1));

    return {
      plant,
      photos,
      upcomingTasks,
      careLogs,
      milestones,
      latestReviewsByProvider,
      reviews,
      healthReports,
    };
  }

  const plantResult = await supabase.from("plants").select("*").eq("id", plantId).maybeSingle();
  if (plantResult.error) {
    throw new Error(plantResult.error.message);
  }

  const plant = plantResult.data as Plant | null;
  if (!plant) {
    return null;
  }

  const [photosResult, tasksResult, careLogsResult, milestonesResult, reviewsResult, healthResult] =
    await Promise.all([
      supabase
        .from("plant_photos")
        .select("*")
        .eq("plant_id", plantId)
        .order("uploaded_at", { ascending: false }),
      supabase
        .from("care_tasks")
        .select("*")
        .eq("plant_id", plantId)
        .is("completed_at", null)
        .order("due_at", { ascending: true }),
      supabase
        .from("care_logs")
        .select("*")
        .eq("plant_id", plantId)
        .order("completed_at", { ascending: false }),
      supabase
        .from("milestones")
        .select("*")
        .eq("plant_id", plantId)
        .order("milestone_date", { ascending: false }),
      supabase
        .from("ai_reviews")
        .select("*")
        .eq("plant_id", plantId)
        .order("reviewed_at", { ascending: false }),
      supabase
        .from("health_reports")
        .select("*")
        .eq("plant_id", plantId)
        .order("created_at", { ascending: false }),
    ]);

  for (const result of [
    photosResult,
    tasksResult,
    careLogsResult,
    milestonesResult,
    reviewsResult,
    healthResult,
  ]) {
    if (result.error) {
      throw new Error(result.error.message);
    }
  }

  const reviews = (reviewsResult.data ?? []) as AiReview[];

  return {
    plant,
    photos: (photosResult.data ?? []) as PlantPhoto[],
    upcomingTasks: (tasksResult.data ?? []) as CareTask[],
    careLogs: (careLogsResult.data ?? []) as CareLog[],
    milestones: (milestonesResult.data ?? []) as Milestone[],
    latestReviewsByProvider: pickLatestReviewByProvider(reviews),
    reviews,
    healthReports: (healthResult.data ?? []) as HealthReport[],
  };
}

export async function getPhotoDetail(
  plantId: string,
  photoId: string,
): Promise<{
  plant: Plant;
  photo: PlantPhoto;
  reviews: AiReview[];
} | null> {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    const store = getMemoryStore();
    const plant = store.plants.find((item) => item.id === plantId);
    const photo = store.photos.find((item) => item.id === photoId && item.plant_id === plantId);

    if (!plant || !photo) {
      return null;
    }

    const reviews = store.aiReviews
      .filter((review) => review.photo_id === photoId)
      .sort((a, b) => (a.reviewed_at < b.reviewed_at ? 1 : -1));

    return { plant, photo, reviews };
  }

  const [plantResult, photoResult, reviewsResult] = await Promise.all([
    supabase.from("plants").select("*").eq("id", plantId).maybeSingle(),
    supabase
      .from("plant_photos")
      .select("*")
      .eq("id", photoId)
      .eq("plant_id", plantId)
      .maybeSingle(),
    supabase.from("ai_reviews").select("*").eq("photo_id", photoId).order("reviewed_at", {
      ascending: false,
    }),
  ]);

  for (const result of [plantResult, photoResult, reviewsResult]) {
    if (result.error) {
      throw new Error(result.error.message);
    }
  }

  const plant = plantResult.data as Plant | null;
  const photo = photoResult.data as PlantPhoto | null;

  if (!plant || !photo) {
    return null;
  }

  return {
    plant,
    photo,
    reviews: (reviewsResult.data ?? []) as AiReview[],
  };
}

export async function listCareTasks(): Promise<CareTask[]> {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return getMemoryStore().careTasks
      .filter((task) => !task.completed_at)
      .sort((a, b) => (a.due_at > b.due_at ? 1 : -1));
  }

  const result = await supabase
    .from("care_tasks")
    .select("*")
    .is("completed_at", null)
    .order("due_at", { ascending: true });

  if (result.error) {
    throw new Error(result.error.message);
  }

  return (result.data ?? []) as CareTask[];
}

export async function listSharePlants(): Promise<DashboardPlantCard[]> {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    const store = getMemoryStore();
    return store.plants
      .filter((plant) => plant.is_public)
      .map((plant) => {
        const latestPhoto = store.photos
          .filter((photo) => photo.plant_id === plant.id)
          .sort((a, b) => (a.uploaded_at < b.uploaded_at ? 1 : -1))[0];

        const nextTask = store.careTasks
          .filter((task) => task.plant_id === plant.id && !task.completed_at)
          .sort((a, b) => (a.due_at > b.due_at ? 1 : -1))[0] ?? null;

        return {
          plant,
          latestPhotoDate: latestPhoto?.uploaded_at ?? null,
          nextTask,
          latestConsensusReview:
            store.aiReviews.find(
              (review) => review.plant_id === plant.id && review.provider === "consensus",
            ) ?? null,
        };
      });
  }

  return listDashboardPlantCards().then((cards) => cards.filter((card) => card.plant.is_public));
}

export async function listPublicMilestones(): Promise<Milestone[]> {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return getMemoryStore()
      .milestones.filter((milestone) => milestone.is_public)
      .sort((a, b) => (a.milestone_date < b.milestone_date ? 1 : -1));
  }

  const result = await supabase
    .from("milestones")
    .select("*")
    .eq("is_public", true)
    .order("milestone_date", { ascending: false });

  if (result.error) {
    throw new Error(result.error.message);
  }

  return (result.data ?? []) as Milestone[];
}

export async function createPlant(input: PlantFormInput): Promise<Plant> {
  const normalized = normalizePlantInput(input);
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    const store = getMemoryStore();
    const now = new Date().toISOString();
    const plant: Plant = {
      id: crypto.randomUUID(),
      nickname: normalized.nickname,
      common_name: normalized.common_name,
      species: normalized.species,
      location: normalized.location,
      light_conditions: normalized.light_conditions,
      watering_notes: normalized.watering_notes,
      fertilizer_notes: normalized.fertilizer_notes,
      soil_notes: normalized.soil_notes,
      current_health_score: normalized.current_health_score ?? 75,
      status: normalized.status ?? "stable",
      cover_photo_url: normalized.cover_photo_url ?? null,
      is_public: normalized.is_public ?? false,
      created_at: now,
      updated_at: now,
    };

    store.plants.unshift(plant);
    return plant;
  }

  const result = await supabase
    .from("plants")
    .insert({
      nickname: normalized.nickname,
      common_name: normalized.common_name,
      species: normalized.species,
      location: normalized.location,
      light_conditions: normalized.light_conditions,
      watering_notes: normalized.watering_notes,
      fertilizer_notes: normalized.fertilizer_notes,
      soil_notes: normalized.soil_notes,
      current_health_score: normalized.current_health_score,
      status: normalized.status,
      cover_photo_url: normalized.cover_photo_url,
      is_public: normalized.is_public,
    })
    .select("*")
    .single();

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data as Plant;
}

export async function updatePlant(plantId: string, input: PlantFormInput): Promise<Plant | null> {
  const normalized = normalizePlantInput(input);
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    const store = getMemoryStore();
    const index = store.plants.findIndex((plant) => plant.id === plantId);
    if (index < 0) {
      return null;
    }

    const updated: Plant = {
      ...store.plants[index],
      ...normalized,
      updated_at: new Date().toISOString(),
      current_health_score: normalized.current_health_score ?? store.plants[index].current_health_score,
      status: normalized.status ?? store.plants[index].status,
      cover_photo_url: normalized.cover_photo_url ?? store.plants[index].cover_photo_url,
      is_public: normalized.is_public ?? store.plants[index].is_public,
    };

    store.plants[index] = updated;
    return updated;
  }

  const result = await supabase
    .from("plants")
    .update({
      nickname: normalized.nickname,
      common_name: normalized.common_name,
      species: normalized.species,
      location: normalized.location,
      light_conditions: normalized.light_conditions,
      watering_notes: normalized.watering_notes,
      fertilizer_notes: normalized.fertilizer_notes,
      soil_notes: normalized.soil_notes,
      current_health_score: normalized.current_health_score,
      status: normalized.status,
      cover_photo_url: normalized.cover_photo_url,
      is_public: normalized.is_public,
      updated_at: new Date().toISOString(),
    })
    .eq("id", plantId)
    .select("*")
    .maybeSingle();

  if (result.error) {
    throw new Error(result.error.message);
  }

  return (result.data as Plant | null) ?? null;
}

export async function createPhoto(input: PhotoInput): Promise<PlantPhoto> {
  const supabase = getSupabaseAdminClient();
  const now = new Date().toISOString();

  if (!supabase) {
    const store = getMemoryStore();
    const photo: PlantPhoto = {
      id: crypto.randomUUID(),
      plant_id: input.plant_id,
      image_url: input.image_url,
      storage_path: input.storage_path ?? null,
      notes: input.notes ?? null,
      uploaded_at: now,
      taken_at: input.taken_at ?? null,
      created_at: now,
    };

    store.photos.unshift(photo);

    const plant = store.plants.find((candidate) => candidate.id === input.plant_id);
    if (plant && !plant.cover_photo_url) {
      plant.cover_photo_url = photo.image_url;
      plant.updated_at = now;
    }

    return photo;
  }

  const result = await supabase
    .from("plant_photos")
    .insert({
      plant_id: input.plant_id,
      image_url: input.image_url,
      storage_path: input.storage_path ?? null,
      notes: input.notes ?? null,
      uploaded_at: now,
      taken_at: input.taken_at ?? null,
    })
    .select("*")
    .single();

  if (result.error) {
    throw new Error(result.error.message);
  }

  const photo = result.data as PlantPhoto;

  await supabase
    .from("plants")
    .update({ cover_photo_url: photo.image_url, updated_at: new Date().toISOString() })
    .eq("id", input.plant_id)
    .is("cover_photo_url", null);

  return photo;
}

export async function saveAiReviews(reviews: AiReview[]): Promise<AiReview[]> {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    const store = getMemoryStore();
    store.aiReviews.unshift(...reviews);
    return reviews;
  }

  const payload = reviews.map((review) => ({
    id: review.id,
    plant_id: review.plant_id,
    photo_id: review.photo_id,
    provider: review.provider,
    model_name: review.model_name,
    plant_identification: review.plant_identification,
    identification_confidence: review.identification_confidence,
    alternate_identifications: review.alternate_identifications,
    visible_condition_summary: review.visible_condition_summary,
    health_score: review.health_score,
    watering_risk: review.watering_risk,
    light_risk: review.light_risk,
    pest_risk: review.pest_risk,
    disease_risk: review.disease_risk,
    immediate_actions: review.immediate_actions,
    daily_care: review.daily_care,
    weekly_care: review.weekly_care,
    monthly_care: review.monthly_care,
    long_term_care: review.long_term_care,
    warning_signs: review.warning_signs,
    next_photo_recommended_at: review.next_photo_recommended_at,
    raw_response: review.raw_response,
    reviewed_at: review.reviewed_at,
    created_at: review.created_at,
  }));

  const result = await supabase.from("ai_reviews").insert(payload).select("*");
  if (result.error) {
    throw new Error(result.error.message);
  }

  return (result.data ?? []) as AiReview[];
}

function generateRealAiReadyReviewSet(plant: Plant, photo: PlantPhoto): AiReview[] {
  // This server-only helper verifies Claude credentials without making paid API calls in v1.
  void getAnthropicApiKey();

  const reviews = generateMockReviewSet(plant, photo);

  return reviews.map((review) => {
    if (review.provider !== "anthropic") {
      return review;
    }

    return {
      ...review,
      model_name: "claude-ready-placeholder-v1",
      raw_response:
        "Real AI mode flag is enabled, but v1.1 still uses mock output until the paid provider adapter is implemented.",
    };
  });
}

export async function refreshBotanistReviews(
  plantId: string,
  photoId: string,
): Promise<{ reviews: AiReview[]; mode: "mock" | "real-ai-ready" }> {
  const plant = await getPlantById(plantId);
  if (!plant) {
    throw new Error("Plant not found.");
  }

  const supabase = getSupabaseAdminClient();
  let photo: PlantPhoto | null = null;

  if (!supabase) {
    photo = getMemoryStore().photos.find((entry) => entry.id === photoId && entry.plant_id === plantId) ?? null;
  } else {
    const photoResult = await supabase
      .from("plant_photos")
      .select("*")
      .eq("id", photoId)
      .eq("plant_id", plantId)
      .maybeSingle();

    if (photoResult.error) {
      throw new Error(photoResult.error.message);
    }

    photo = (photoResult.data as PlantPhoto | null) ?? null;
  }

  if (!photo) {
    throw new Error("Photo not found for this plant.");
  }

  const shouldUseRealAiPath = isRealAiEnabled() && hasAnthropicApiKeyConfigured();

  const reviews = shouldUseRealAiPath
    ? generateRealAiReadyReviewSet(plant, photo)
    : generateMockReviewSet(plant, photo);

  const saved = await saveAiReviews(reviews);

  return { reviews: saved, mode: shouldUseRealAiPath ? "real-ai-ready" : "mock" };
}

export function getPhotosBucketName(): string {
  return getPhotoBucket();
}

export async function uploadPhotoToStorage(
  file: File,
  plantId: string,
): Promise<{ imageUrl: string; storagePath: string }> {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");
    return {
      imageUrl: `data:${file.type};base64,${base64}`,
      storagePath: `mock/${plantId}/${Date.now()}-${file.name}`,
    };
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const storagePath = `${plantId}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

  const uploadResult = await supabase.storage.from(getPhotoBucket()).upload(storagePath, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || "image/jpeg",
    metadata: {
      plant_id: plantId,
      uploaded_at: new Date().toISOString(),
    },
  });

  if (uploadResult.error) {
    throw new Error(uploadResult.error.message);
  }

  const publicUrlResult = supabase.storage.from(getPhotoBucket()).getPublicUrl(storagePath);

  return {
    imageUrl: publicUrlResult.data.publicUrl,
    storagePath,
  };
}

export function hasSupabaseConfig(): boolean {
  return isSupabaseConfigured();
}
