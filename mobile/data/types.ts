import { LifeDomain } from "@better-you/shared";

export type GoalStatus = "ACTIVE" | "QUEUED" | "COMPLETED" | "PAUSED";
export type EngagementStatus = "on-track" | "drifting" | "at-risk";
export type GoalStepStatus = "done" | "partial" | "skipped";

export interface CheckIn {
  date: string; // ISO date (YYYY-MM-DD)
  difficulty: 1 | 2 | 3 | null;
  mood: 1 | 2 | 3 | null;
  description?: string;
}

export interface GoalStep {
  id: string;
  name: string;
  status: GoalStepStatus;
  checkIns: CheckIn[];
}

export interface Goal {
  id: string;
  title: string;
  domain: LifeDomain;
  status: GoalStatus;
  progress: number; // 0–100
  minutesPerWeek?: number;
  assignedDays?: string[]; // e.g. ["Mon", "Wed", "Fri"]
  engagementStatus?: EngagementStatus;
  startDate?: string; // ISO date
  steps?: GoalStep[];
}
