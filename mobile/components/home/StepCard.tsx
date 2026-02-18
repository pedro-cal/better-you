import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@/src/contexts/ThemeContext";
import { Step } from "@better-you/shared";
import { getCardStyle, Spacing } from "@/constants/DesignTokens";

interface StepCardProps {
  step: Step;
  onPress?: () => void;
}

export function StepCard({ step, onPress }: StepCardProps) {
  const { colors } = useTheme();

  const renderStatusIndicator = () => {
    switch (step.status) {
      case "DONE":
        return (
          <View style={styles.doneIndicator}>
            <Text style={[styles.doneIcon, { color: colors.primary }]}>✓</Text>
          </View>
        );
      case "TODO":
        return <Text style={[styles.todoLabel, { color: colors.textSecondary }]}>TO DO</Text>;
      default:
        return null;
    }
  };

  const renderRightContent = () => {
    if (step.status === "DONE" && step.completionCount && step.completionCount > 1) {
      return (
        <Text style={[styles.completionCount, { color: colors.textSecondary }]}>
          DONE {step.completionCount}X
        </Text>
      );
    }

    if (step.progress !== undefined && step.status !== "TODO") {
      return (
        <Text style={[styles.progress, { color: colors.textSecondary }]}>{step.progress}%</Text>
      );
    }

    return null;
  };

  const isCompleted = step.status === "DONE";
  const titleStyle = isCompleted
    ? [styles.title, styles.titleCompleted, { color: colors.textSecondary }]
    : [styles.title, { color: colors.textPrimary }];

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: colors.cardBackground,
          shadowColor: colors.shadowColor,
          borderColor: colors.cardBorderHighlight,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftSection}>
        {renderStatusIndicator()}
        <Text style={titleStyle}>{step.title}</Text>
      </View>

      <View style={styles.rightSection}>{renderRightContent()}</View>

      {step.progress !== undefined && step.status !== "TODO" && step.status !== "DONE" && (
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { backgroundColor: colors.progressBackground }]}>
            <View
              style={[
                styles.progressFill,
                { width: `${step.progress}%`, backgroundColor: colors.textPrimary },
              ]}
            />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    ...getCardStyle("medium"),
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  doneIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  doneIcon: {
    fontSize: 16,
    fontWeight: "700",
  },
  todoLabel: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginRight: 12,
    minWidth: 40,
  },
  title: {
    fontSize: 16,
    flex: 1,
  },
  titleCompleted: {
    textDecorationLine: "line-through",
  },
  rightSection: {
    position: "absolute",
    right: 16,
    top: 16,
  },
  completionCount: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  progress: {
    fontSize: 13,
    fontWeight: "600",
  },
  progressBarContainer: {
    marginTop: 12,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
  },
});
