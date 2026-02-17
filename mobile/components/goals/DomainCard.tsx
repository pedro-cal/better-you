import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { LifeDomain } from "@better-you/shared";

interface DomainCardProps {
  domain?: LifeDomain;
  domainName?: string;
  activeGoals: number;
  completionPercentage: number;
  iconName?: string;
  isSummary?: boolean;
}

export function DomainCard({
  domain,
  domainName,
  activeGoals,
  completionPercentage,
  iconName,
  isSummary = false,
}: DomainCardProps) {
  const cardStyle = isSummary ? [styles.container, styles.summaryContainer] : styles.container;
  const iconColor = Colors.textPrimary;
  const textColor = Colors.textPrimary;

  return (
    <View style={cardStyle}>
      <View style={styles.header}>
        {iconName && <Ionicons name={iconName as any} size={24} color={iconColor} />}
        {isSummary && <Ionicons name="grid" size={24} color={iconColor} />}
        <Text style={[styles.percentage, { color: iconColor }]}>{completionPercentage}%</Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.domainName, { color: textColor }]} numberOfLines={1}>
          {isSummary ? "All Goals" : domainName}
        </Text>
        <Text style={[styles.goalsLabel, { color: Colors.textSecondary }]}>
          {activeGoals} {isSummary ? "Total Active" : "Active Goals"}
        </Text>
      </View>

      <View style={[styles.progressBar, isSummary && styles.summaryProgressBar]}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${completionPercentage}%`,
              backgroundColor: Colors.primary,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    aspectRatio: 1.25, // Reduced height (was 1:1, now 1.25:1)
    justifyContent: "space-between",
  },
  summaryContainer: {
    backgroundColor: Colors.cardBackground,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  percentage: {
    fontSize: 16,
    fontWeight: "700",
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  domainName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  goalsLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    letterSpacing: 0.3,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.progressBackground,
    borderRadius: 2,
    overflow: "hidden",
  },
  summaryProgressBar: {
    backgroundColor: Colors.primaryDark,
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary,
  },
});
