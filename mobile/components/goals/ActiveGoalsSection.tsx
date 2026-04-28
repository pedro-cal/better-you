import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/src/contexts/ThemeContext";
import { Spacing, Typography } from "@/constants/DesignTokens";
import { Goal } from "@/data/mockData";
import { GoalCard } from "./GoalCard";

interface ActiveGoalsSectionProps {
  goals: Goal[];
}

export function ActiveGoalsSection({ goals }: ActiveGoalsSectionProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={styles.titleRow}>
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Active Goals</Text>
        </View>
        <Text style={[styles.count, { color: colors.textTertiary }]}>
          {goals.length} IN PROGRESS
        </Text>
      </View>

      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.xxl,
    marginTop: Spacing.xxl,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sectionTitle: {
    ...Typography.title3,
  },
  count: {
    ...Typography.body3,
    letterSpacing: 0.5,
  },
});
