import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Colors } from "@/constants/Colors";

interface WeeklyLoadCardProps {
  percentage: number;
  title: string;
  subtitle: string;
}

export function WeeklyLoadCard({ percentage, title, subtitle }: WeeklyLoadCardProps) {
  const size = 80;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.progressCircle}>
          <Svg width={size} height={size} style={styles.svg}>
            {/* Background circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={Colors.progressBackground}
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Progress circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={Colors.primary}
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
            <Text style={styles.percentageText}>{percentage}%</Text>
            <Text style={styles.checklistLabel}>Load</Text>
          </View>
        </View>

        <View style={styles.textContent}>
          <Text style={styles.label}>PERFORMANCE</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 24,
    marginTop: 24,
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
    fontSize: 24,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  checklistLabel: {
    fontSize: 8,
    fontWeight: "600",
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  textContent: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.primary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
});
