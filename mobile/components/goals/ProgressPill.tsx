import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/src/contexts/ThemeContext";

interface ProgressPillProps {
  stage: 1 | 2;
}

export function ProgressPill({ stage }: ProgressPillProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      <View
        style={[
          styles.pill,
          {
            backgroundColor: stage === 1 ? `${colors.primary}22` : colors.cardBackgroundLight,
            borderColor: stage === 1 ? colors.primary : colors.border,
          },
        ]}
      >
        <Text style={[styles.label, { color: stage === 1 ? colors.primary : colors.textTertiary }]}>
          1 · Define
        </Text>
      </View>
      <View style={[styles.line, { backgroundColor: colors.border }]} />
      <View
        style={[
          styles.pill,
          {
            backgroundColor: stage === 2 ? `${colors.primary}22` : colors.cardBackgroundLight,
            borderColor: stage === 2 ? colors.primary : colors.border,
          },
        ]}
      >
        <Text style={[styles.label, { color: stage === 2 ? colors.primary : colors.textTertiary }]}>
          2 · Add Steps
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  line: {
    width: 24,
    height: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
