import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@/src/contexts/ThemeContext";
import { Step } from "@better-you/shared";
import { getCardStyle, Spacing } from "@/constants/DesignTokens";

interface NextStepCardProps {
  step: Step;
  onDone?: () => void;
  onPartial?: () => void;
  onSkip?: () => void;
}

export function NextStepCard({ step, onDone, onPartial, onSkip }: NextStepCardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.cardBackground,
          shadowColor: colors.shadowColor,
          borderColor: colors.cardBorderHighlight,
        },
      ]}
    >
      <Text style={[styles.label, { color: colors.primary }]}>NEXT STEP</Text>

      <Text style={[styles.title, { color: colors.textPrimary }]}>{step.title}</Text>

      {step.goalTitle && (
        <View style={styles.goalRow}>
          <View style={[styles.goalDot, { backgroundColor: colors.primary }]} />
          <Text style={[styles.goalText, { color: colors.textPrimary }]}>
            Goal: {step.goalTitle}
          </Text>
        </View>
      )}

      {step.progress !== undefined && (
        <View style={styles.progressSection}>
          <View style={styles.progressInfo}>
            <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
              {step.duration}
            </Text>
            <Text style={[styles.progressPercentage, { color: colors.textSecondary }]}>
              {step.progress}%
            </Text>
          </View>
          <View style={[styles.progressBar, { backgroundColor: colors.progressBackground }]}>
            <View
              style={[
                styles.progressFill,
                { width: `${step.progress}%`, backgroundColor: colors.primary },
              ]}
            />
          </View>
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.cardBackgroundLight }]}
          onPress={onDone}
        >
          <Text style={[styles.doneIcon, { color: colors.primary }]}>✓</Text>
          <Text style={[styles.doneText, { color: colors.primary }]}>DONE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.cardBackgroundLight }]}
          onPress={onPartial}
        >
          <Text style={[styles.partialIcon, { color: colors.textPrimary }]}>—</Text>
          <Text style={[styles.partialText, { color: colors.textPrimary }]}>PARTIAL</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.cardBackgroundLight }]}
          onPress={onSkip}
        >
          <Text style={[styles.skipIcon, { color: colors.textPrimary }]}>✕</Text>
          <Text style={[styles.skipText, { color: colors.textPrimary }]}>SKIP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...getCardStyle("large"),
    padding: Spacing.xxl,
    marginHorizontal: Spacing.xxl,
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    lineHeight: 34,
    marginBottom: 12,
  },
  goalRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  goalDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  goalText: {
    fontSize: 14,
  },
  progressSection: {
    marginBottom: 20,
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
  },
  progressPercentage: {
    fontSize: 13,
    fontWeight: "600",
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.lg,
    borderRadius: 12,
    gap: 4,
  },
  doneIcon: {
    fontSize: 20,
    fontWeight: "700",
  },
  doneText: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  partialIcon: {
    fontSize: 20,
    fontWeight: "700",
  },
  partialText: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  skipIcon: {
    fontSize: 18,
    fontWeight: "700",
  },
  skipText: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
