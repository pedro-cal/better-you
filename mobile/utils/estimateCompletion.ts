/**
 * Estimates goal completion date from current progress and start date.
 *
 * Assumptions:
 * - Progress accrues at a constant (linear) rate.
 * - Total projected duration = elapsed_days / (progress / 100).
 * - Remaining days = total_projected_duration - elapsed_days.
 * - Returns null when progress is 0 (insufficient data) or >= 100 (finished).
 */
export function estimateCompletionDate(progress: number, startDate: string): Date | null {
  if (progress <= 0 || progress >= 100) return null;

  const start = new Date(startDate);
  const now = new Date();
  const daysElapsed = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

  if (daysElapsed <= 0) return null;

  const totalDays = (daysElapsed / progress) * 100;
  const daysRemaining = Math.ceil(totalDays - daysElapsed);

  const result = new Date(now);
  result.setDate(result.getDate() + daysRemaining);
  return result;
}

export function formatEstimatedDate(date: Date | null): string {
  if (!date) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
