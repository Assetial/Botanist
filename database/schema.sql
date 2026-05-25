-- Botanist v1 schema
-- Run in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists plants (
  id uuid primary key default gen_random_uuid(),
  nickname text not null,
  common_name text not null,
  species text not null,
  location text not null,
  light_conditions text not null,
  watering_notes text not null default '',
  fertilizer_notes text not null default '',
  soil_notes text not null default '',
  current_health_score integer not null default 75 check (current_health_score between 0 and 100),
  status text not null default 'stable' check (status in ('thriving', 'stable', 'needs-attention')),
  cover_photo_url text,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists plant_photos (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid not null references plants(id) on delete cascade,
  image_url text not null,
  storage_path text,
  notes text,
  uploaded_at timestamptz not null default now(),
  taken_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists health_reports (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid not null references plants(id) on delete cascade,
  photo_id uuid references plant_photos(id) on delete set null,
  health_score integer not null check (health_score between 0 and 100),
  leaf_color_score integer not null check (leaf_color_score between 0 and 100),
  posture_score integer not null check (posture_score between 0 and 100),
  soil_score integer not null check (soil_score between 0 and 100),
  growth_score integer not null check (growth_score between 0 and 100),
  pest_risk text not null check (pest_risk in ('low', 'medium', 'high')),
  watering_risk text not null check (watering_risk in ('low', 'medium', 'high')),
  summary text not null,
  recommended_actions text not null,
  created_at timestamptz not null default now()
);

create table if not exists care_tasks (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid not null references plants(id) on delete cascade,
  task_type text not null check (task_type in ('watering', 'fertilizing', 'rotation', 'pest_inspection', 'photo_reminder')),
  title text not null,
  description text not null,
  due_at timestamptz not null,
  recurrence_rule text,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists care_logs (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid not null references plants(id) on delete cascade,
  task_type text not null check (task_type in ('watering', 'fertilizing', 'rotation', 'pest_inspection', 'photo_reminder')),
  notes text not null,
  completed_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists milestones (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid not null references plants(id) on delete cascade,
  title text not null,
  description text not null,
  photo_url text,
  milestone_date date not null,
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists ai_reviews (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid not null references plants(id) on delete cascade,
  photo_id uuid not null references plant_photos(id) on delete cascade,
  provider text not null check (provider in ('openai', 'anthropic', 'consensus', 'manual')),
  model_name text not null,
  plant_identification text not null,
  identification_confidence numeric(5,4) not null check (identification_confidence between 0 and 1),
  alternate_identifications text,
  visible_condition_summary text not null,
  health_score integer not null check (health_score between 0 and 100),
  watering_risk text not null check (watering_risk in ('low', 'medium', 'high')),
  light_risk text not null check (light_risk in ('low', 'medium', 'high')),
  pest_risk text not null check (pest_risk in ('low', 'medium', 'high')),
  disease_risk text not null check (disease_risk in ('low', 'medium', 'high')),
  immediate_actions text not null,
  daily_care text not null,
  weekly_care text not null,
  monthly_care text not null,
  long_term_care text not null,
  warning_signs text not null,
  next_photo_recommended_at timestamptz,
  raw_response text,
  reviewed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists idx_plant_photos_plant_uploaded on plant_photos (plant_id, uploaded_at desc);
create index if not exists idx_care_tasks_plant_due on care_tasks (plant_id, due_at asc) where completed_at is null;
create index if not exists idx_care_logs_plant_completed on care_logs (plant_id, completed_at desc);
create index if not exists idx_milestones_plant_date on milestones (plant_id, milestone_date desc);
create index if not exists idx_health_reports_plant_created on health_reports (plant_id, created_at desc);
create index if not exists idx_ai_reviews_photo_provider_reviewed on ai_reviews (photo_id, provider, reviewed_at desc);
create index if not exists idx_ai_reviews_plant_provider_reviewed on ai_reviews (plant_id, provider, reviewed_at desc);

create or replace function touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists plants_touch_updated_at on plants;
create trigger plants_touch_updated_at
before update on plants
for each row
execute function touch_updated_at();