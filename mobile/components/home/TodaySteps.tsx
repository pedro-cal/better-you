import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Colors } from "@/constants/Colors";
import { Step } from "@better-you/shared";
import { StepCard } from "./StepCard";

interface TodayStepsProps {
  steps: Step[];
  onStepPress?: (step: Step) => void;
}

export function TodaySteps({ steps, onStepPress }: TodayStepsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>TODAY'S STEPS</Text>
      <View style={styles.stepsList}>
        {steps.map((step) => (
          <StepCard key={step.id} step={step} onPress={() => onStepPress?.(step)} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 100, // Space for bottom nav
  },
  heading: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.textSecondary,
    letterSpacing: 1,
    marginBottom: 16,
  },
  stepsList: {
    gap: 0, // Margin handled by StepCard
  },
});
