import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { Step } from "@better-you/shared";

interface StepCardProps {
  step: Step;
  onPress?: () => void;
}

export function StepCard({ step, onPress }: StepCardProps) {
  const renderStatusIndicator = () => {
    switch (step.status) {
      case "DONE":
        return (
          <View style={styles.doneIndicator}>
            <Text style={styles.doneIcon}>✓</Text>
          </View>
        );
      case "TODO":
        return <Text style={styles.todoLabel}>TO DO</Text>;
      default:
        return null;
    }
  };

  const renderRightContent = () => {
    if (step.status === "DONE" && step.completionCount && step.completionCount > 1) {
      return <Text style={styles.completionCount}>DONE {step.completionCount}X</Text>;
    }

    if (step.progress !== undefined && step.status !== "TODO") {
      return <Text style={styles.progress}>{step.progress}%</Text>;
    }

    return null;
  };

  const isCompleted = step.status === "DONE";
  const titleStyle = isCompleted ? [styles.title, styles.titleCompleted] : styles.title;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.leftSection}>
        {renderStatusIndicator()}
        <Text style={titleStyle}>{step.title}</Text>
      </View>

      <View style={styles.rightSection}>{renderRightContent()}</View>

      {step.progress !== undefined && step.status !== "TODO" && step.status !== "DONE" && (
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${step.progress}%` }]} />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
    color: Colors.primary,
    fontWeight: "700",
  },
  todoLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    marginRight: 12,
    minWidth: 40,
  },
  title: {
    fontSize: 16,
    color: Colors.textPrimary,
    flex: 1,
  },
  titleCompleted: {
    textDecorationLine: "line-through",
    color: Colors.textSecondary,
  },
  rightSection: {
    position: "absolute",
    right: 16,
    top: 16,
  },
  completionCount: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  progress: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  progressBarContainer: {
    marginTop: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.progressBackground,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.textPrimary, // Quiet mode - white
  },
});
