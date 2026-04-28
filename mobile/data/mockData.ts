import { DomainStats, AllDomainStats, Step } from "@better-you/shared";
export type {
  Goal,
  GoalStatus,
  GoalStep,
  CheckIn,
  EngagementStatus,
  GoalStepStatus,
} from "./types";
import type { Goal } from "./types";

// ============================================
// Goals
// ============================================

export const mockGoals: Goal[] = [
  {
    id: "g1",
    title: "Marathon Training",
    domain: "BODY",
    status: "ACTIVE",
    progress: 45,
    minutesPerWeek: 180,
    assignedDays: ["Mon", "Wed", "Fri", "Sun"],
    engagementStatus: "on-track",
    startDate: "2026-01-06",
    steps: [
      {
        id: "g1s1",
        name: "Long run (10km+)",
        status: "done",
        checkIns: [
          { date: "2026-02-16", difficulty: 2, mood: 3, description: "Felt strong at the end" },
          { date: "2026-02-19", difficulty: 2, mood: 2 },
        ],
      },
      {
        id: "g1s2",
        name: "Recovery jog (5km)",
        status: "partial",
        checkIns: [
          {
            date: "2026-02-17",
            difficulty: 1,
            mood: 2,
            description: "Cut short due to knee soreness",
          },
        ],
      },
      {
        id: "g1s3",
        name: "Strength training",
        status: "done",
        checkIns: [
          { date: "2026-02-18", difficulty: 3, mood: 2 },
          { date: "2026-02-21", difficulty: 2, mood: 3 },
        ],
      },
    ],
  },
  {
    id: "g2",
    title: "Emergency Fund",
    domain: "MONEY",
    status: "ACTIVE",
    progress: 20,
    minutesPerWeek: 30,
    assignedDays: ["Sun"],
    engagementStatus: "drifting",
    startDate: "2026-01-06",
    steps: [
      {
        id: "g2s1",
        name: "Weekly budget review",
        status: "skipped",
        checkIns: [
          { date: "2026-02-09", difficulty: 1, mood: 1, description: "Skipped — busy week" },
        ],
      },
      {
        id: "g2s2",
        name: "Transfer to savings",
        status: "done",
        checkIns: [{ date: "2026-02-16", difficulty: 1, mood: 2 }],
      },
      {
        id: "g2s3",
        name: "Review spending categories",
        status: "partial",
        checkIns: [
          { date: "2026-02-16", difficulty: 2, mood: 1, description: "Overspent on dining again" },
        ],
      },
    ],
  },
  {
    id: "g3",
    title: "Learn Japanese",
    domain: "MIND",
    status: "ACTIVE",
    progress: 62,
    minutesPerWeek: 90,
    assignedDays: ["Tue", "Thu", "Sat"],
    engagementStatus: "on-track",
    startDate: "2025-11-01",
    steps: [
      {
        id: "g3s1",
        name: "Anki flashcards (30m)",
        status: "done",
        checkIns: [
          { date: "2026-02-18", difficulty: 1, mood: 3 },
          { date: "2026-02-20", difficulty: 1, mood: 3, description: "Reviewed N4 vocab set" },
        ],
      },
      {
        id: "g3s2",
        name: "Grammar lesson",
        status: "done",
        checkIns: [
          { date: "2026-02-18", difficulty: 2, mood: 2, description: "て-form conjugations" },
          { date: "2026-02-20", difficulty: 2, mood: 3 },
        ],
      },
      {
        id: "g3s3",
        name: "Listening practice",
        status: "partial",
        checkIns: [
          {
            date: "2026-02-15",
            difficulty: 3,
            mood: 2,
            description: "Hard to follow native speed",
          },
        ],
      },
    ],
  },
  { id: "g4", title: "Certification Prep", domain: "WORK", status: "QUEUED", progress: 0 },
  { id: "g5", title: "Read 12 Books", domain: "MIND", status: "QUEUED", progress: 0 },
  { id: "g6", title: "Weekly Volunteering", domain: "SERVICE", status: "QUEUED", progress: 0 },
];

export const mockActiveGoals = mockGoals.filter((g) => g.status === "ACTIVE");

// ============================================
// Domain Stats
// ============================================

export const mockDomainStats: DomainStats[] = [
  { domain: "BODY", activeGoals: 5, completionPercentage: 75, onTrack: 3, drifting: 1, atRisk: 1 },
  { domain: "MIND", activeGoals: 3, completionPercentage: 60, onTrack: 2, drifting: 1, atRisk: 0 },
  {
    domain: "SOCIAL",
    activeGoals: 2,
    completionPercentage: 50,
    onTrack: 1,
    drifting: 0,
    atRisk: 1,
  },
  { domain: "WORK", activeGoals: 4, completionPercentage: 80, onTrack: 3, drifting: 1, atRisk: 0 },
  { domain: "MONEY", activeGoals: 1, completionPercentage: 40, onTrack: 0, drifting: 1, atRisk: 0 },
  {
    domain: "SERVICE",
    activeGoals: 2,
    completionPercentage: 90,
    onTrack: 2,
    drifting: 0,
    atRisk: 0,
  },
  {
    domain: "SPIRITUALITY",
    activeGoals: 3,
    completionPercentage: 65,
    onTrack: 2,
    drifting: 0,
    atRisk: 1,
  },
];

export const mockAllStats: AllDomainStats = {
  totalActiveGoals: 20,
  overallCompletion: 67,
  onTrack: 13,
  drifting: 4,
  atRisk: 3,
};

// ============================================
// Steps
// ============================================

export const mockNextStep: Step = {
  id: "s1",
  title: "45m Study for certification",
  goalTitle: "Certification Prep",
  duration: "4/30",
  progress: 13,
  status: "IN_PROGRESS",
};

export const mockTodaySteps: Step[] = [
  { id: "s2", title: "30m read latest book", status: "IN_PROGRESS", progress: 45 },
  { id: "s3", title: "30m ride the bike", status: "DONE", completionCount: 17 },
  { id: "s4", title: "15m Meditation", status: "TODO" },
  { id: "s5", title: "Review Weekly Goals", status: "TODO" },
  { id: "s6", title: "Prep Meals for Tmrw", status: "TODO" },
];

// Derived from steps — change step statuses above to see this update
export const mockDailyProgress = {
  completed: mockTodaySteps.filter((s) => s.status === "DONE").length,
  total: mockTodaySteps.length,
};

// ============================================
// Quotes (one per screen)
// ============================================

export const mockQuotes = {
  home: {
    quote: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
  },
  goals: {
    quote: "A goal without a plan is just a wish.",
    author: "Antoine de Saint-Exupéry",
  },
  metrics: {
    quote: "What gets measured gets managed.",
    author: "Peter Drucker",
  },
};
