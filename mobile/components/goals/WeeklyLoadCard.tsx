import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useTheme } from "@/src/contexts/ThemeContext";
import { getCardStyle, Spacing, Typography } from "@/constants/DesignTokens";

interface WeeklyLoadCardProps {
  percentage: number;
  title: string;
  subtitle: string;
}

export function WeeklyLoadCard({ percentage, title, subtitle }: WeeklyLoadCardProps) {
  const { colors } = useTheme();
  const size = 80;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

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
      <View style={styles.content}>
        <View style={styles.progressCircle}>
          <Svg width={size} height={size} style={styles.svg}>
            {/* Background circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={colors.progressBackground}
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Progress circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={colors.primary}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              rotation="-90"
              origin={`${size / 2}, ${size / 2}`}
            />
          </Svg>
          <View style={styles.progressText}>
            <Text style={[styles.percentageText, { color: colors.textPrimary }]}>
              {percentage}%
            </Text>
            <Text style={[styles.checklistLabel, { color: colors.textSecondary }]}>Load</Text>
          </View>
        </View>

        <View style={styles.textContent}>
          <Text style={[styles.label, { color: colors.primary }]}>PERFORMANCE</Text>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...getCardStyle("large"),
    padding: Spacing.xl,
    marginHorizontal: Spacing.xxl,
    marginTop: Spacing.xxl,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  progressCircle: {
    width: 80,
    height: 80,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  svg: {
    position: "absolute",
  },
  progressText: {
    alignItems: "center",
    justifyContent: "center",
  },
  percentageText: {
    ...Typography.title1,
  },
  checklistLabel: {
    ...Typography.body3,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  textContent: {
    flex: 1,
  },
  label: {
    ...Typography.body3,
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    ...Typography.title2,
    marginBottom: 4,
  },
  subtitle: {
    ...Typography.body2,
  },
});
