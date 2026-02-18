import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useTheme } from "@/src/contexts/ThemeContext";

interface ProgressBarProps {
  completed: number;
  total: number;
  avatarUrl?: string;
  variant?: "highlight" | "quiet";
}

export function ProgressBar({ completed, total, avatarUrl, variant = "quiet" }: ProgressBarProps) {
  const { colors } = useTheme();
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  const fillColor = variant === "highlight" ? colors.progressFill : colors.textPrimary;

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Text style={[styles.completedText, { color: colors.textSecondary }]}>
          {completed} DONE
        </Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { backgroundColor: colors.progressBackground }]}>
            <View
              style={[styles.progressFill, { width: `${percentage}%`, backgroundColor: fillColor }]}
            />
          </View>
        </View>
      </View>

      <View style={styles.rightSection}>
        <Text style={[styles.totalText, { color: colors.textSecondary }]}>{total} TO DO</Text>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <View
            style={[styles.avatarPlaceholder, { backgroundColor: colors.cardBackgroundLight }]}
          />
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
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  progressBarContainer: {
    width: "100%",
  },
  progressBar: {
    height: 8,
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
  },
});
