import { cloneDemoData } from "@/lib/mock-data";
import type { AiReview, CareLog, CareTask, HealthReport, Milestone, Plant, PlantPhoto } from "@/lib/types";

export interface BotanistMemoryStore {
  plants: Plant[];
  photos: PlantPhoto[];
  careTasks: CareTask[];
  careLogs: CareLog[];
  milestones: Milestone[];
  healthReports: HealthReport[];
  aiReviews: AiReview[];
}

declare global {
  var __botanistMemoryStore: BotanistMemoryStore | undefined;
}

function createStore(): BotanistMemoryStore {
  return cloneDemoData();
}

export function getMemoryStore(): BotanistMemoryStore {
  if (!globalThis.__botanistMemoryStore) {
    globalThis.__botanistMemoryStore = createStore();
  }

  return globalThis.__botanistMemoryStore;
}