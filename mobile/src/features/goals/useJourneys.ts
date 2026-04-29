import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/src/lib/apiClient";
import type { LifeDomain } from "@better-you/shared";
import type { Goal } from "@/data/types";

export interface ApiJourney {
  id: string;
  userId: string;
  domain: LifeDomain;
  title: string;
  description: string | null;
  narrative: string | null;
  state: string;
  createdAt: string;
  updatedAt: string;
}

export function toJourneyAsGoal(j: ApiJourney): Goal {
  return {
    id: j.id,
    title: j.title,
    domain: j.domain,
    status: j.state === "active" ? "ACTIVE" : j.state === "paused" ? "PAUSED" : "ACTIVE",
    progress: 0,
  };
}

export function useJourneys() {
  return useQuery({
    queryKey: ["journeys"],
    queryFn: () => apiFetch<ApiJourney[]>("/api/journeys").then((r) => r.data),
  });
}
