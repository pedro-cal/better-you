import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@/src/contexts/ThemeContext";
import { getCardStyle, Spacing, Typography } from "@/constants/DesignTokens";
import { Goal, GoalStep, CheckIn, EngagementStatus, GoalStepStatus } from "@/data/types";
import { estimateCompletionDate, formatEstimatedDate } from "@/utils/estimateCompletion";
import { DomainIcon } from "./DomainCard";
import { DOMAIN_ICONS } from "./DomainGrid";

const DOMAIN_LABELS: Record<string, string> = {
  BODY: "Body & Fitness",
  MIND: "Mind & Learning",
  SOCIAL: "Social",
  WORK: "Work & Career",
  MONEY: "Finance",
  SERVICE: "Service",
  SPIRITUALITY: "Spirituality",
};

const ENGAGEMENT_LABELS: Record<EngagementStatus, string> = {
  "on-track": "On Track",
  drifting: "Drifting",
  "at-risk": "At Risk",
};

// Muted tones that don't fight the dark theme
const ENGAGEMENT_COLORS: Record<EngagementStatus, string> = {
  "on-track": "#7FBF7F", // matches colors.primary
  drifting: "#C8A96E", // muted amber
  "at-risk": "#BF8B7A", // muted warm coral (not bright red)
};

const STEP_STATUS_ICONS: Record<GoalStepStatus, keyof typeof Ionicons.glyphMap> = {
  done: "checkmark-circle",
  partial: "remove-circle-outline",
  skipped: "ellipse-outline",
};

interface GoalCardProps {
  goal: Goal;
}

function RatingDots({ value, color }: { value: number | null; color: string }) {
  if (value === null) return null;
  const dots = [1, 2, 3].map((i) => (i <= value ? "●" : "○")).join("");
  return <Text style={[styles.ratingDots, { color }]}>{dots}</Text>;
}

const DIFFICULTY_ICON: Record<number, { name: string; color: string }> = {
  1: { name: "leaf", color: "#7FBF7F" },
  2: { name: "dumbbell", color: "#C8A96E" },
  3: { name: "mountain", color: "#BF8B7A" },
};

function DifficultyIcon({ value }: { value: number }) {
  const def = DIFFICULTY_ICON[value] ?? DIFFICULTY_ICON[1];
  return <FontAwesome5 name={def.name as any} size={16} color={def.color} />;
}

function StepRow({ step }: { step: GoalStep }) {
  const { colors } = useTheme();
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const latestCheckIn: CheckIn | null =
    step.checkIns.length > 0 ? step.checkIns[step.checkIns.length - 1] : null;

  const iconName = STEP_STATUS_ICONS[step.status];
  const iconColor =
    step.status === "done"
      ? "#7FBF7F"
      : step.status === "partial"
        ? colors.textSecondary
        : colors.textTertiary;

  const hasIcons = latestCheckIn?.difficulty != null || latestCheckIn?.mood != null;

  function handleIconsPress() {
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
    if (tooltipVisible) {
      setTooltipVisible(false);
      return;
    }
    setTooltipVisible(true);
    dismissTimer.current = setTimeout(() => setTooltipVisible(false), 2500);
  }

  useEffect(
    () => () => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
    },
    [],
  );

  return (
    <View style={styles.stepRow}>
      <Ionicons name={iconName} size={14} color={iconColor} style={styles.stepIcon} />
      <View style={styles.stepContent}>
        <Text style={[styles.stepName, { color: colors.textPrimary }]}>{step.name}</Text>
        {latestCheckIn?.description ? (
          <Text style={[styles.stepDescription, { color: colors.textTertiary }]} numberOfLines={2}>
            {latestCheckIn.description}
          </Text>
        ) : null}
      </View>
      {hasIcons && (
        <View style={styles.stepIconsWrapper}>
          <TouchableOpacity onPress={handleIconsPress} style={styles.stepIcons} activeOpacity={0.7}>
            {latestCheckIn?.difficulty != null && (
              <DifficultyIcon value={latestCheckIn.difficulty} />
            )}
            {latestCheckIn?.mood != null && (
              <Text style={styles.moodEmoji}>
                {latestCheckIn.mood === 1 ? "😔" : latestCheckIn.mood === 2 ? "😐" : "😊"}
              </Text>
            )}
          </TouchableOpacity>
          {tooltipVisible && (
            <View
              style={[
                styles.tooltip,
                {
                  backgroundColor: colors.cardBackgroundLight,
                  borderColor: colors.cardBorderHighlight,
                },
              ]}
            >
              {[
                { icon: "🌿", label: "Easy" },
                { icon: "💪", label: "Medium" },
                { icon: "⛰️", label: "Hard" },
                { icon: "😔", label: "Low" },
                { icon: "😐", label: "Okay" },
                { icon: "😊", label: "Great" },
              ].map((item) => (
                <View key={item.label} style={styles.tooltipCell}>
                  <Text style={styles.tooltipIcon}>{item.icon}</Text>
                  <Text style={[styles.tooltipText, { color: colors.textSecondary }]}>
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

export function GoalCard({ goal }: GoalCardProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const iconDef = DOMAIN_ICONS[goal.domain];

  const engagementColor = goal.engagementStatus
    ? ENGAGEMENT_COLORS[goal.engagementStatus]
    : colors.textTertiary;

  const estimatedDate =
    goal.startDate != null
      ? formatEstimatedDate(estimateCompletionDate(goal.progress, goal.startDate))
      : "—";

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => setExpanded((v) => !v)}
      style={[
        styles.card,
        getCardStyle("medium"),
        {
          backgroundColor: colors.cardBackground,
          shadowColor: colors.shadowColor,
          borderColor: colors.cardBorderHighlight,
        },
      ]}
    >
      {/* ── Collapsed row ── */}
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: colors.cardBackgroundLight }]}>
          <DomainIcon iconDef={iconDef} size={16} color={colors.primary} />
        </View>

        <View style={styles.titleBlock}>
          <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>
            {goal.title}
          </Text>
          <Text style={[styles.domainLabel, { color: colors.textTertiary }]}>
            {DOMAIN_LABELS[goal.domain]}
          </Text>
        </View>

        <View style={[styles.badge, { backgroundColor: colors.cardBackgroundLight }]}>
          <Text style={[styles.badgeText, { color: colors.primary }]}>{goal.status}</Text>
        </View>

        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={14}
          color={colors.textTertiary}
          style={styles.chevron}
        />
      </View>

      {/* ── Progress bar ── */}
      <View style={styles.progressRow}>
        <Text style={[styles.progressLabel, { color: colors.textTertiary }]}>Progress</Text>
        <View style={[styles.progressTrack, { backgroundColor: colors.progressBackground }]}>
          <View
            style={[
              styles.progressFill,
              { width: `${goal.progress}%`, backgroundColor: colors.progressFill },
            ]}
          />
        </View>
        <Text style={[styles.progressPct, { color: colors.textSecondary }]}>{goal.progress}%</Text>
      </View>

      {/* ── Expanded area ── */}
      {expanded && (
        <View style={[styles.expandedArea, { borderTopColor: colors.border }]}>
          {/* Section 1 — Goal Details */}
          <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>DETAILS</Text>
          <View style={[styles.detailsGrid, { backgroundColor: colors.background }]}>
            <View style={styles.detailRow}>
              <Text style={[styles.detailKey, { color: colors.textTertiary }]}>Load</Text>
              <Text style={[styles.detailValue, { color: colors.textSecondary }]}>
                {goal.minutesPerWeek != null ? `${goal.minutesPerWeek} min/wk` : "—"}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailKey, { color: colors.textTertiary }]}>Days</Text>
              <Text style={[styles.detailValue, { color: colors.textSecondary }]}>
                {goal.assignedDays?.join(" · ") ?? "—"}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailKey, { color: colors.textTertiary }]}>Engagement</Text>
              <Text style={[styles.detailValue, { color: engagementColor }]}>
                {goal.engagementStatus ? ENGAGEMENT_LABELS[goal.engagementStatus] : "—"}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailKey, { color: colors.textTertiary }]}>Est. complete</Text>
              <Text style={[styles.detailValue, { color: colors.textSecondary }]}>
                {estimatedDate}
              </Text>
            </View>
          </View>

          {/* Section 2 — Steps */}
          {goal.steps && goal.steps.length > 0 && (
            <>
              <View style={[styles.sectionDivider, { backgroundColor: colors.border }]} />
              <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>STEPS</Text>
              {goal.steps.map((step, idx) => (
                <React.Fragment key={step.id}>
                  <StepRow step={step} />
                  {idx < (goal.steps?.length ?? 0) - 1 && (
                    <View style={[styles.stepDivider, { backgroundColor: colors.border }]} />
                  )}
                </React.Fragment>
              ))}
            </>
          )}

          {/* Edit footer */}
          <View style={[styles.editFooter, { borderTopColor: colors.border }]}>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                router.push(`/goals/${goal.id}`);
              }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={[styles.editLink, { color: colors.textTertiary }]}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  titleBlock: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...Typography.body1,
  },
  domainLabel: {
    ...Typography.body3,
    textTransform: "uppercase",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeText: {
    ...Typography.body3,
    letterSpacing: 0.5,
  },
  chevron: {
    marginLeft: 2,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  progressLabel: {
    ...Typography.body3,
    width: 64,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  progressPct: {
    ...Typography.body3,
    minWidth: 30,
    textAlign: "right",
  },
  expandedArea: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    gap: Spacing.xs,
  },
  sectionLabel: {
    ...Typography.body3,
    marginBottom: 2,
  },
  detailsGrid: {
    gap: Spacing.xs,
    borderRadius: 8,
    padding: Spacing.md,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  detailKey: {
    ...Typography.body2,
  },
  detailValue: {
    ...Typography.body2,
  },
  sectionDivider: {
    height: 1,
    marginVertical: Spacing.sm,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
    paddingVertical: 4,
  },
  stepIcon: {
    marginTop: 1,
  },
  stepContent: {
    flex: 1,
    gap: 3,
  },
  stepName: {
    ...Typography.body2,
  },
  stepDescription: {
    ...Typography.body3,
    lineHeight: 16,
  },
  stepIconsWrapper: {
    alignItems: "flex-end",
  },
  stepIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingLeft: Spacing.sm,
    paddingVertical: 2,
  },
  moodEmoji: {
    fontSize: 18,
  },
  tooltip: {
    position: "absolute",
    bottom: "100%",
    right: 0,
    marginBottom: 6,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    width: 198,
    zIndex: 10,
  },
  tooltipCell: {
    width: "33.33%",
    alignItems: "center",
    paddingVertical: 4,
    gap: 2,
  },
  tooltipIcon: {
    fontSize: 16,
  },
  tooltipText: {
    ...Typography.body3,
    letterSpacing: 0,
  },
  stepDivider: {
    height: 1,
    marginLeft: 22,
  },
  editFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: Spacing.sm,
    marginTop: Spacing.xs,
    borderTopWidth: 1,
  },
  editLink: {
    fontSize: 13,
    fontWeight: "500",
  },
});
