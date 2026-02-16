import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { Step } from "@better-you/shared";

interface NextStepCardProps {
  step: Step;
  onDone?: () => void;
  onPartial?: () => void;
  onSkip?: () => void;
}

export function NextStepCard({ step, onDone, onPartial, onSkip }: NextStepCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>NEXT STEP</Text>

      <Text style={styles.title}>{step.title}</Text>

      {step.goalTitle && (
        <View style={styles.goalRow}>
          <View style={styles.goalDot} />
          <Text style={styles.goalText}>Goal: {step.goalTitle}</Text>
        </View>
      )}

      {step.progress !== undefined && (
        <View style={styles.progressSection}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressLabel}>{step.duration}</Text>
            <Text style={styles.progressPercentage}>{step.progress}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${step.progress}%` }]} />
          </View>
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionButton, styles.doneButton]} onPress={onDone}>
          <Text style={styles.doneIcon}>✓</Text>
          <Text style={styles.doneText}>DONE</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.partialButton]} onPress={onPartial}>
          <Text style={styles.partialIcon}>—</Text>
          <Text style={styles.partialText}>PARTIAL</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.skipButton]} onPress={onSkip}>
          <Text style={styles.skipIcon}>✕</Text>
          <Text style={styles.skipText}>SKIP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 24,
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.primary,
    letterSpacing: 1,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: Colors.textPrimary,
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
    backgroundColor: Colors.primary,
    marginRight: 8,
  },
  goalText: {
    fontSize: 14,
    color: Colors.textPrimary,
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
    color: Colors.textSecondary,
  },
  progressPercentage: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.progressBackground,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary,
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
    paddingVertical: 16,
    borderRadius: 12,
    gap: 4,
  },
  doneButton: {
    backgroundColor: Colors.cardBackgroundLight,
  },
  partialButton: {
    backgroundColor: Colors.cardBackgroundLight,
  },
  skipButton: {
    backgroundColor: Colors.cardBackgroundLight,
  },
  doneIcon: {
    fontSize: 20,
    color: Colors.primary,
    fontWeight: "700",
  },
  doneText: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  partialIcon: {
    fontSize: 20,
    color: Colors.textPrimary,
    fontWeight: "700",
  },
  partialText: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  skipIcon: {
    fontSize: 18,
    color: Colors.textPrimary,
    fontWeight: "700",
  },
  skipText: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
});
