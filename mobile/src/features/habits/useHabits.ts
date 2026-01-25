import { useQuery } from "@tanstack/react-query";

export type Habit = { id: string; title: string; doneToday: boolean };

const mock: Habit[] = [
  { id: "1", title: "Pray 10m", doneToday: false },
  { id: "2", title: "Run 15m", doneToday: true },
];

export function useHabits() {
  return useQuery({ queryKey: ["habits"], queryFn: async () => mock });
}
