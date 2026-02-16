import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Colors } from "@/constants/Colors";

interface ProgressBarProps {
  completed: number;
  total: number;
  avatarUrl?: string;
  variant?: "highlight" | "quiet";
}

export function ProgressBar({ completed, total, avatarUrl, variant = "quiet" }: ProgressBarProps) {
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  const fillColor = variant === "highlight" ? Colors.progressFill : Colors.textPrimary;

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Text style={styles.completedText}>{completed} DONE</Text>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${percentage}%`, backgroundColor: fillColor }]}
            />
          </View>
        </View>
      </View>

      <View style={styles.rightSection}>
        <Text style={styles.totalText}>{total} TO DO</Text>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  leftSection: {
    flex: 1,
    marginRight: 16,
  },
  completedText: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  progressBarContainer: {
    width: "100%",
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.progressBackground,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  rightSection: {
    alignItems: "flex-end",
  },
  totalText: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.cardBackgroundLight,
  },
});
