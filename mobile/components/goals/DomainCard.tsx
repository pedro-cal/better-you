import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useTheme } from "@/src/contexts/ThemeContext";
import { LifeDomain } from "@better-you/shared";
import { getCardStyle, Spacing } from "@/constants/DesignTokens";
import { DomainIconDef } from "./DomainGrid";

interface DomainCardProps {
  domain?: LifeDomain;
  domainName?: string;
  activeGoals: number;
  completionPercentage: number;
  iconDef?: DomainIconDef;
  isSummary?: boolean;
}

function DomainIcon({
  iconDef,
  size,
  color,
}: {
  iconDef: DomainIconDef;
  size: number;
  color: string;
}) {
  if (iconDef.library === "FontAwesome5") {
    return <FontAwesome5 name={iconDef.name as any} size={size} color={color} />;
  }
  return <Ionicons name={iconDef.name as any} size={size} color={color} />;
}

export function DomainCard({
  domain,
  domainName,
  activeGoals,
  completionPercentage,
  iconDef,
  isSummary = false,
}: DomainCardProps) {
  const { colors } = useTheme();
  const cardStyle = isSummary ? [styles.container, styles.summaryContainer] : styles.container;
  const iconColor = colors.textPrimary;
  const textColor = colors.textPrimary;

  return (
    <View
      style={[
        cardStyle,
        {
          backgroundColor: colors.cardBackground,
          shadowColor: colors.shadowColor,
          borderColor: colors.cardBorderHighlight,
        },
      ]}
    >
      <View style={styles.header}>
        {iconDef && <DomainIcon iconDef={iconDef} size={24} color={iconColor} />}
        {isSummary && <Ionicons name="grid" size={24} color={iconColor} />}
        <Text style={[styles.percentage, { color: iconColor }]}>{completionPercentage}%</Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.domainName, { color: textColor }]} numberOfLines={1}>
          {isSummary ? "All Goals" : domainName}
        </Text>
        <Text style={[styles.goalsLabel, { color: colors.textSecondary }]}>
          {activeGoals} {isSummary ? "Total Active" : "Active Goals"}
        </Text>
      </View>

      <View
        style={[
          styles.progressBar,
          { backgroundColor: isSummary ? colors.primaryDark : colors.progressBackground },
          isSummary && styles.summaryProgressBar,
        ]}
      >
        <View
          style={[
            styles.progressFill,
            {
              width: `${completionPercentage}%`,
              backgroundColor: colors.primary,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...getCardStyle("large"),
    padding: Spacing.lg,
    aspectRatio: 1.25,
    justifyContent: "space-between",
  },
  summaryContainer: {},
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
    marginBottom: 4,
  },
  goalsLabel: {
    fontSize: 11,
    letterSpacing: 0.3,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  summaryProgressBar: {},
  progressFill: {
    height: "100%",
  },
});
