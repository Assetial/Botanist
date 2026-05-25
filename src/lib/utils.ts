import type { PlantStatus, RiskLevel } from "@/lib/types";

export function formatDateTime(value: string | null | undefined): string {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatDate(value: string | null | undefined): string {
  if (!value) {
    return "Not scheduled";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Not scheduled";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function statusLabel(status: PlantStatus): string {
  switch (status) {
    case "thriving":
      return "Thriving";
    case "stable":
      return "Stable";
    case "needs-attention":
      return "Needs Attention";
    default:
      return status;
  }
}

export function riskLabel(risk: RiskLevel): string {
  switch (risk) {
    case "low":
      return "Low";
    case "medium":
      return "Medium";
    case "high":
      return "High";
    default:
      return risk;
  }
}

export function scoreClass(score: number): string {
  if (score >= 80) {
    return "text-emerald-700 bg-emerald-100";
  }

  if (score >= 60) {
    return "text-amber-700 bg-amber-100";
  }

  return "text-rose-700 bg-rose-100";
}

export function slugifySegment(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function parseNumber(value: string | null, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}