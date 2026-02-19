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
      <View style={styles.labelsRow}>
        <Text style={[styles.completedText, { color: colors.textSecondary }]}>
          {completed} DONE
        </Text>
        <Text style={[styles.totalText, { color: colors.textSecondary }]}>{total} TO DO</Text>
      </View>
      <View style={[styles.progressBar, { backgroundColor: colors.progressBackground }]}>
        <View
          style={[styles.progressFill, { width: `${percentage}%`, backgroundColor: fillColor }]}
        />
      </View>
      {avatarUrl ? <Image source={{ uri: avatarUrl }} style={styles.avatar} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  labelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  completedText: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  totalText: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
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
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginTop: 12,
    alignSelf: "flex-end",
  },
});
