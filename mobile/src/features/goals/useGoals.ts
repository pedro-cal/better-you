import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/src/lib/apiClient";
import type { LifeDomain, DomainStats, AllDomainStats } from "@better-you/shared";
import type { Goal, GoalStatus } from "@/data/types";

export interface ApiGoal {
  id: string;
  userId: string;
  journeyId: string | null;
  domain: LifeDomain;
  title: string;
  intent: string | null;
  completionCriteria: string | null;
  state: string;
  activatedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

const STATE_TO_STATUS: Record<string, GoalStatus> = {
  active: "ACTIVE",
  queued: "QUEUED",
  completed: "COMPLETED",
  paused: "PAUSED",
  draft: "QUEUED",
  abandoned: "PAUSED",
  archived: "COMPLETED",
};

const LIFE_DOMAINS: LifeDomain[] = [
  "BODY",
  "MIND",
  "SOCIAL",
  "WORK",
  "MONEY",
  "SERVICE",
  "SPIRITUALITY",
];

export function toGoal(g: ApiGoal): Goal {
  return {
    id: g.id,
    title: g.title,
    domain: g.domain,
    status: STATE_TO_STATUS[g.state] ?? "QUEUED",
    progress: 0,
    startDate: g.activatedAt ?? undefined,
  };
}

export function computeDomainStats(goals: ApiGoal[]): DomainStats[] {
  const active = goals.filter((g) => g.state === "active");
  return LIFE_DOMAINS.map((domain) => {
    const n = active.filter((g) => g.domain === domain).length;
    return { domain, activeGoals: n, completionPercentage: 0, onTrack: n, drifting: 0, atRisk: 0 };
  }).filter((s) => s.activeGoals > 0);
}

export function computeAllStats(goals: ApiGoal[]): AllDomainStats {
  const n = goals.filter((g) => g.state === "active").length;
  return { totalActiveGoals: n, overallCompletion: 0, onTrack: n, drifting: 0, atRisk: 0 };
}

export function useGoals() {
  return useQuery({
    queryKey: ["goals"],
    queryFn: () => apiFetch<ApiGoal[]>("/api/goals").then((r) => r.data),
  });
}
