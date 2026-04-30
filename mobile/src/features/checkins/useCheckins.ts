import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/src/lib/apiClient";
import { useGoals, type ApiGoal } from "@/src/features/goals/useGoals";
import type { ApiStep, ApiCheckin, Step } from "@better-you/shared";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function toStepStatus(status: ApiCheckin["status"]): Step["status"] {
  if (status === "done") return "DONE";
  if (status === "skipped") return "SKIPPED";
  return "TODO";
}

export function useCheckins() {
  const goalsQuery = useGoals();
  const activeGoals = (goalsQuery.data ?? []).filter((g) => g.state === "active");

  return useQuery({
    queryKey: ["today-steps", activeGoals.map((g) => g.id)],
    queryFn: async (): Promise<Step[]> => {
      const today = todayISO();

      const [stepsPerGoal, checkinsResult] = await Promise.all([
        Promise.all(
          activeGoals.map((g: ApiGoal) =>
            apiFetch<ApiStep[]>(`/api/goals/${g.id}/steps`).then((r) =>
              r.data.map((s) => ({ ...s, goalTitle: g.title })),
            ),
          ),
        ),
        apiFetch<ApiCheckin[]>(`/api/checkins?dateFrom=${today}&dateTo=${today}`).then(
          (r) => r.data,
        ),
      ]);

      const allSteps = stepsPerGoal.flat();
      const checkinsByStepId = new Map(checkinsResult.map((c) => [c.stepId, c]));

      return allSteps.map((step): Step => {
        const checkin = checkinsByStepId.get(step.id);
        return {
          id: step.id,
          title: step.title,
          goalTitle: (step as ApiStep & { goalTitle?: string }).goalTitle,
          duration: step.estimatedMinutes ? `${step.estimatedMinutes}m` : undefined,
          status: checkin ? toStepStatus(checkin.status) : "TODO",
        };
      });
    },
    enabled: !goalsQuery.isLoading,
    placeholderData: [],
  });
}
