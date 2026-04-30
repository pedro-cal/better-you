import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/src/lib/apiClient";
import { queryClient } from "@/src/state/query";

interface SubmitCheckinArgs {
  stepId: string;
  status: "done" | "skipped";
  date?: string;
}

export function useSubmitCheckin() {
  return useMutation({
    mutationFn: ({ stepId, status, date }: SubmitCheckinArgs) =>
      apiFetch("/api/checkins", {
        method: "POST",
        body: JSON.stringify({
          stepId,
          date: date ?? new Date().toISOString().slice(0, 10),
          status,
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["today-steps"] });
    },
  });
}
