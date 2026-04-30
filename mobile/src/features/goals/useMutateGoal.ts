import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/src/lib/apiClient";
import type { ApiGoal, GoalState, CreateGoalInput } from "@better-you/shared";

interface CreateGoalResult {
  goal: ApiGoal;
  overload: { utilization: number; recommendedState: string };
}

export function useCreateGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: CreateGoalInput) =>
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
