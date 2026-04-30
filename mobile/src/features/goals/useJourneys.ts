import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/src/lib/apiClient";
import type { ApiJourney } from "@better-you/shared";
import type { Goal } from "@/data/types";

export type { ApiJourney };

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
