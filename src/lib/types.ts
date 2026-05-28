export type PlantStatus = "thriving" | "stable" | "needs-attention";

export type CareTaskType =
  | "watering"
  | "fertilizing"
  | "rotation"
  | "pest_inspection"
  | "photo_reminder";

export type ReviewProvider = "openai" | "anthropic" | "consensus" | "manual";

export type RiskLevel = "low" | "medium" | "high";

export type TimelineEventType =
  | "watered"
  | "fertilized"
  | "repotted"
  | "rotated"
  | "pruned"
  | "misted"
  | "pest_issue"
  | "new_leaf"
  | "note"
  | "photo";

export interface Plant {
  id: string;
  nickname: string;
  common_name: string;
  species: string;
  location: string;
  light_conditions: string;
  watering_notes: string;
  fertilizer_notes: string;
  soil_notes: string;
  current_health_score: number;
  status: PlantStatus;
  cover_photo_url: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlantPhoto {
  id: string;
  plant_id: string;
  image_url: string;
  storage_path: string | null;
  notes: string | null;
  uploaded_at: string;
  taken_at: string | null;
  created_at: string;
}

export interface HealthReport {
  id: string;
  plant_id: string;
  photo_id: string | null;
  health_score: number;
  leaf_color_score: number;
  posture_score: number;
  soil_score: number;
  growth_score: number;
  pest_risk: RiskLevel;
  watering_risk: RiskLevel;
  summary: string;
  recommended_actions: string;
  created_at: string;
}

export interface AiReview {
  id: string;
  plant_id: string;
  photo_id: string;
  provider: ReviewProvider;
  model_name: string;
  plant_identification: string;
  identification_confidence: number;
  alternate_identifications: string | null;
  visible_condition_summary: string;
  health_score: number;
  watering_risk: RiskLevel;
  light_risk: RiskLevel;
  pest_risk: RiskLevel;
  disease_risk: RiskLevel;
  immediate_actions: string;
  daily_care: string;
  weekly_care: string;
  monthly_care: string;
  long_term_care: string;
  warning_signs: string;
  next_photo_recommended_at: string | null;
  raw_response: string | null;
  reviewed_at: string;
  created_at: string;
}

export interface CareTask {
  id: string;
  plant_id: string;
  task_type: CareTaskType;
  title: string;
  description: string;
  due_at: string;
  recurrence_rule: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface CareLog {
  id: string;
  plant_id: string;
  task_type: CareTaskType;
  notes: string;
  completed_at: string;
  created_at: string;
}

export interface Milestone {
  id: string;
  plant_id: string;
  title: string;
  description: string;
  photo_url: string | null;
  milestone_date: string;
  is_public: boolean;
  created_at: string;
}

export interface DashboardPlantCard {
  plant: Plant;
  latestPhotoDate: string | null;
  nextTask: CareTask | null;
  latestConsensusReview: AiReview | null;
}

export interface PlantDetailBundle {
  plant: Plant;
  photos: PlantPhoto[];
  upcomingTasks: CareTask[];
  careLogs: CareLog[];
  milestones: Milestone[];
  latestReviewsByProvider: Partial<Record<ReviewProvider, AiReview>>;
  reviews: AiReview[];
  healthReports: HealthReport[];
}
export interface TimelineEvent {
  id: string;
  plant_id: string;
  event_type: TimelineEventType;
  event_at: string;
  note: string | null;
  created_at: string;
}
