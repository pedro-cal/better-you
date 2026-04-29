import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/src/lib/apiClient";
import type { LifeDomain } from "@better-you/shared";
import type { ApiGoal } from "./useGoals";

type GoalState = "queued" | "draft" | "active" | "paused" | "completed" | "abandoned" | "archived";

interface CreateGoalVars {
  domain: LifeDomain;
  title: string;
  intent?: string;
  completionCriteria?: string;
  journeyId?: string;
}

interface CreateGoalResult {
  goal: ApiGoal;
  overload: { utilization: number; recommendedState: string };
}

export function useCreateGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: CreateGoalVars) =>
      apiFetch<CreateGoalResult>("/api/goals", {
        method: "POST",
        body: JSON.stringify(vars),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] }),
  });
}

export function useTransitionGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, to }: { id: string; to: GoalState }) =>
      apiFetch<ApiGoal>(`/api/goals/${id}/transition`, {
        method: "POST",
        body: JSON.stringify({ to }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] }),
  });
}
