import type {
  AiReview,
  CareLog,
  CareTask,
  HealthReport,
  Milestone,
  Plant,
  PlantPhoto,
  TimelineEvent,
} from "@/lib/types";

const now = new Date();

function daysAgo(days: number): string {
  const value = new Date(now);
  value.setDate(value.getDate() - days);
  return value.toISOString();
}

function daysFromNow(days: number): string {
  const value = new Date(now);
  value.setDate(value.getDate() + days);
  return value.toISOString();
}

export const demoPlants: Plant[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    nickname: "Mona",
    common_name: "Monstera",
    species: "Monstera deliciosa",
    location: "Living room window",
    light_conditions: "Bright indirect",
    watering_notes: "Water every 8-10 days when top 2 inches feel dry.",
    fertilizer_notes: "Half-strength balanced feed once monthly in spring.",
    soil_notes: "Chunky aroid mix with bark and perlite.",
    current_health_score: 86,
    status: "thriving",
    cover_photo_url:
      "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=800&q=80",
    is_public: true,
    created_at: daysAgo(120),
    updated_at: daysAgo(2),
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    nickname: "Benny",
    common_name: "Basil",
    species: "Ocimum basilicum",
    location: "Kitchen counter",
    light_conditions: "6+ hours direct",
    watering_notes: "Keep consistently moist, never soggy.",
    fertilizer_notes: "Light feed every 2 weeks.",
    soil_notes: "Rich potting mix with compost.",
    current_health_score: 72,
    status: "stable",
    cover_photo_url:
      "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=800&q=80",
    is_public: false,
    created_at: daysAgo(45),
    updated_at: daysAgo(1),
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    nickname: "Sylvia",
    common_name: "Snake Plant",
    species: "Dracaena trifasciata",
    location: "Bedroom shelf",
    light_conditions: "Low to medium indirect",
    watering_notes: "Water every 3 weeks, let soil dry fully.",
    fertilizer_notes: "Feed every 6-8 weeks during growing season.",
    soil_notes: "Fast-draining cactus blend.",
    current_health_score: 91,
    status: "thriving",
    cover_photo_url:
      "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=800&q=80",
    is_public: true,
    created_at: daysAgo(240),
    updated_at: daysAgo(5),
  },
];

export const demoPhotos: PlantPhoto[] = [
  {
    id: "p1-photo-1",
    plant_id: demoPlants[0].id,
    image_url:
      "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1200&q=80",
    storage_path: null,
    notes: "New split leaf opened this week.",
    uploaded_at: daysAgo(2),
    taken_at: daysAgo(3),
    created_at: daysAgo(2),
  },
  {
    id: "p2-photo-1",
    plant_id: demoPlants[1].id,
    image_url:
      "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1200&q=80",
    storage_path: null,
    notes: "Leaves soft after heatwave; moved closer to sink.",
    uploaded_at: daysAgo(1),
    taken_at: daysAgo(1),
    created_at: daysAgo(1),
  },
  {
    id: "p3-photo-1",
    plant_id: demoPlants[2].id,
    image_url:
      "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=1200&q=80",
    storage_path: null,
    notes: "Soil fully dry before watering.",
    uploaded_at: daysAgo(6),
    taken_at: daysAgo(6),
    created_at: daysAgo(6),
  },
];

export const demoCareTasks: CareTask[] = [
  {
    id: "task-1",
    plant_id: demoPlants[0].id,
    task_type: "watering",
    title: "Water Mona",
    description: "Water slowly until a little drains out of the pot.",
    due_at: daysFromNow(2),
    recurrence_rule: "FREQ=DAILY;INTERVAL=9",
    completed_at: null,
    created_at: daysAgo(8),
  },
  {
    id: "task-2",
    plant_id: demoPlants[1].id,
    task_type: "pest_inspection",
    title: "Inspect Benny leaves",
    description: "Check under leaves for aphids after watering.",
    due_at: daysFromNow(1),
    recurrence_rule: "FREQ=WEEKLY;INTERVAL=1",
    completed_at: null,
    created_at: daysAgo(10),
  },
  {
    id: "task-3",
    plant_id: demoPlants[2].id,
    task_type: "photo_reminder",
    title: "Upload Sylvia progress photo",
    description: "Capture full plant and top layer of soil.",
    due_at: daysFromNow(5),
    recurrence_rule: "FREQ=WEEKLY;INTERVAL=2",
    completed_at: null,
    created_at: daysAgo(12),
  },
];

export const demoCareLogs: CareLog[] = [
  {
    id: "log-1",
    plant_id: demoPlants[0].id,
    task_type: "rotation",
    notes: "Rotated quarter turn to even out growth.",
    completed_at: daysAgo(4),
    created_at: daysAgo(4),
  },
  {
    id: "log-2",
    plant_id: demoPlants[1].id,
    task_type: "watering",
    notes: "Bottom-watered for 12 minutes.",
    completed_at: daysAgo(3),
    created_at: daysAgo(3),
  },
  {
    id: "log-3",
    plant_id: demoPlants[2].id,
    task_type: "fertilizing",
    notes: "Fed with diluted cactus fertilizer.",
    completed_at: daysAgo(15),
    created_at: daysAgo(15),
  },
];

export const demoMilestones: Milestone[] = [
  {
    id: "mile-1",
    plant_id: demoPlants[0].id,
    title: "First fenestrated leaf",
    description: "Mona opened her first true split leaf.",
    photo_url: demoPhotos[0].image_url,
    milestone_date: daysAgo(10),
    is_public: true,
    created_at: daysAgo(10),
  },
  {
    id: "mile-2",
    plant_id: demoPlants[1].id,
    title: "First harvest",
    description: "Trimmed top basil leaves for pasta night.",
    photo_url: demoPhotos[1].image_url,
    milestone_date: daysAgo(5),
    is_public: true,
    created_at: daysAgo(5),
  },
];

export const demoHealthReports: HealthReport[] = [
  {
    id: "health-1",
    plant_id: demoPlants[0].id,
    photo_id: demoPhotos[0].id,
    health_score: 86,
    leaf_color_score: 90,
    posture_score: 85,
    soil_score: 78,
    growth_score: 88,
    pest_risk: "low",
    watering_risk: "medium",
    summary: "Strong color and new growth with slight soil dryness.",
    recommended_actions: "Water within 48 hours and keep humidity above 45%.",
    created_at: daysAgo(2),
  },
  {
    id: "health-2",
    plant_id: demoPlants[1].id,
    photo_id: demoPhotos[1].id,
    health_score: 72,
    leaf_color_score: 75,
    posture_score: 70,
    soil_score: 68,
    growth_score: 74,
    pest_risk: "medium",
    watering_risk: "medium",
    summary: "Mild droop likely related to recent heat stress.",
    recommended_actions: "Increase watering consistency and check airflow.",
    created_at: daysAgo(1),
  },
];

export const demoAiReviews: AiReview[] = [
  {
    id: "review-1-openai",
    plant_id: demoPlants[0].id,
    photo_id: demoPhotos[0].id,
    provider: "openai",
    model_name: "mock-openai-botanist-v1",
    plant_identification: "Monstera deliciosa",
    identification_confidence: 0.92,
    alternate_identifications: "Monstera borsigiana",
    visible_condition_summary: "Healthy leaf pattern and upright petioles.",
    health_score: 87,
    watering_risk: "medium",
    light_risk: "low",
    pest_risk: "low",
    disease_risk: "low",
    immediate_actions: "Water within 2 days and wipe leaves.",
    daily_care: "Check topsoil moisture with fingertip.",
    weekly_care: "Rotate pot 90 degrees.",
    monthly_care: "Inspect roots and clean support pole.",
    long_term_care: "Repot if roots circle the base heavily.",
    warning_signs: "Yellowing lower leaves and limp stems.",
    next_photo_recommended_at: daysFromNow(7),
    raw_response: "Mock analysis generated without API keys.",
    reviewed_at: daysAgo(2),
    created_at: daysAgo(2),
  },
  {
    id: "review-1-anthropic",
    plant_id: demoPlants[0].id,
    photo_id: demoPhotos[0].id,
    provider: "anthropic",
    model_name: "mock-claude-botanist-v1",
    plant_identification: "Monstera deliciosa",
    identification_confidence: 0.89,
    alternate_identifications: "Monstera adansonii",
    visible_condition_summary: "Leaf split quality is good with slight dry edge.",
    health_score: 85,
    watering_risk: "medium",
    light_risk: "low",
    pest_risk: "low",
    disease_risk: "low",
    immediate_actions: "Add a small humidity boost and water soon.",
    daily_care: "Observe leaf firmness and temperature swings.",
    weekly_care: "Inspect underside for mites.",
    monthly_care: "Prune damaged leaf tips if needed.",
    long_term_care: "Keep near bright indirect light source.",
    warning_signs: "Crispy margins on newest leaves.",
    next_photo_recommended_at: daysFromNow(6),
    raw_response: "Mock analysis generated without API keys.",
    reviewed_at: daysAgo(2),
    created_at: daysAgo(2),
  },
  {
    id: "review-1-consensus",
    plant_id: demoPlants[0].id,
    photo_id: demoPhotos[0].id,
    provider: "consensus",
    model_name: "mock-consensus-v1",
    plant_identification: "Monstera deliciosa",
    identification_confidence: 0.9,
    alternate_identifications: "",
    visible_condition_summary:
      "Consensus: healthy growth, moderate watering risk, low pest risk.",
    health_score: 86,
    watering_risk: "medium",
    light_risk: "low",
    pest_risk: "low",
    disease_risk: "low",
    immediate_actions: "Water within 48 hours and keep humidity steady.",
    daily_care: "Quick soil dryness check.",
    weekly_care: "Rotate and inspect foliage.",
    monthly_care: "Assess root crowding.",
    long_term_care: "Plan repot within the next growth cycle.",
    warning_signs: "Persistent droop after watering.",
    next_photo_recommended_at: daysFromNow(7),
    raw_response: "Computed from mock provider outputs.",
    reviewed_at: daysAgo(2),
    created_at: daysAgo(2),
  },
];


export const demoTimelineEvents: TimelineEvent[] = [
  {
    id: "timeline-1",
    plant_id: demoPlants[0].id,
    event_type: "watered",
    event_at: daysAgo(4),
    note: "Watered until runoff.",
    created_at: daysAgo(4),
  },
  {
    id: "timeline-2",
    plant_id: demoPlants[1].id,
    event_type: "fertilized",
    event_at: daysAgo(15),
    note: "Used half-strength liquid feed.",
    created_at: daysAgo(15),
  },
];

export function cloneDemoData() {
  return {
    plants: structuredClone(demoPlants),
    photos: structuredClone(demoPhotos),
    careTasks: structuredClone(demoCareTasks),
    careLogs: structuredClone(demoCareLogs),
    milestones: structuredClone(demoMilestones),
    healthReports: structuredClone(demoHealthReports),
    aiReviews: structuredClone(demoAiReviews),
    timelineEvents: structuredClone(demoTimelineEvents),
  };
}