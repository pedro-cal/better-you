import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useTheme } from "@/src/contexts/ThemeContext";
import { LifeDomain } from "@better-you/shared";
import { getCardStyle, Spacing } from "@/constants/DesignTokens";
import { DomainIconDef } from "./DomainGrid";

export interface DomainBreakdownItem {
  domain: LifeDomain;
  iconDef: DomainIconDef;
  onTrack: number;
  activeGoals: number;
}

interface DomainCardProps {
  domain?: LifeDomain;
  domainName?: string;
  activeGoals: number;
  completionPercentage: number;
  onTrack: number;
  drifting: number;
  atRisk: number;
  iconDef?: DomainIconDef;
  isSummary?: boolean;
  domainBreakdown?: DomainBreakdownItem[];
}

export function DomainIcon({
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
  onTrack,
  drifting,
  atRisk,
  iconDef,
  isSummary = false,
  domainBreakdown,
}: DomainCardProps) {
  const { colors } = useTheme();
  const cardStyle = isSummary
    ? [styles.container, styles.summaryContainer]
    : [styles.container, styles.domainContainer];
  const iconColor = colors.textPrimary;
  const healthPct = activeGoals > 0 ? Math.round((onTrack / activeGoals) * 100) : 0;

  return (
    <View>
      {isSummary ? (
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          Domain Engagement
        </Text>
      ) : null}
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
        {/* Icon + Name row (domain cards only) */}
        {!isSummary && (
          <View style={styles.header}>
            {iconDef && <DomainIcon iconDef={iconDef} size={18} color={iconColor} />}
            <Text style={[styles.domainName, { color: iconColor }]} numberOfLines={1}>
              {domainName}
            </Text>
          </View>
        )}

        {isSummary && domainBreakdown ? (
          /* Summary: per-domain health bars */
          <View style={styles.breakdownBlock}>
            {domainBreakdown.map((item) => {
              const pct =
                item.activeGoals > 0 ? Math.round((item.onTrack / item.activeGoals) * 100) : 0;
              return (
                <View key={item.domain} style={styles.breakdownRow}>
                  <View style={styles.breakdownIcon}>
                    <DomainIcon iconDef={item.iconDef} size={19} color={colors.textPrimary} />
                  </View>
                  <Text style={[styles.breakdownLabel, { color: colors.textSecondary }]}>
                    {item.domain.charAt(0) + item.domain.slice(1).toLowerCase()}
                  </Text>
                  <View
                    style={[styles.breakdownBar, { backgroundColor: colors.progressBackground }]}
                  >
                    <View
                      style={[
                        styles.breakdownFill,
                        { width: `${pct}%`, backgroundColor: colors.primary },
                      ]}
                    />
                  </View>
                  <Text style={[styles.breakdownScore, { color: colors.textSecondary }]}>
                    {(pct / 10).toFixed(1)}
                  </Text>
                </View>
              );
            })}
          </View>
        ) : (
          /* Domain card: on track / drifting / at risk */
          <View style={styles.statsBlock}>
            <View style={styles.statRow}>
              <FontAwesome5 name="angle-double-up" size={11} color={colors.primary} />
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>On track</Text>
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>{onTrack}</Text>
            </View>
            <View style={styles.statRow}>
              <FontAwesome5 name="angle-down" size={11} color={colors.textTertiary} />
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Drifting</Text>
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>{drifting}</Text>
            </View>
            <View style={styles.statRow}>
              <FontAwesome5 name="angle-double-down" size={11} color={colors.textTertiary} />
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>At risk</Text>
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>{atRisk}</Text>
            </View>
          </View>
        )}

        {!isSummary && (
          <View style={styles.progressRow}>
            <View style={[styles.progressBar, { backgroundColor: colors.progressBackground }]}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${healthPct}%`, backgroundColor: colors.primary },
                ]}
              />
            </View>
            <Text style={[styles.percentage, { color: colors.textSecondary }]}>{healthPct}%</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...getCardStyle("large"),
    padding: Spacing.lg,
    justifyContent: "space-between",
  },
  domainContainer: {
    aspectRatio: 1.25,
  },
  summaryContainer: {},
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 8,
    marginLeft: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 8,
  },
  domainName: {
    fontSize: 14,
    fontWeight: "600",
    flexShrink: 1,
  },
  // Summary breakdown
  breakdownBlock: {
    flex: 1,
    justifyContent: "space-evenly",
    marginBottom: 8,
  },
  breakdownRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  breakdownIcon: {
    width: 22,
    alignItems: "center",
  },
  breakdownLabel: {
    fontSize: 13,
    width: 80,
  },
  breakdownScore: {
    fontSize: 12,
    fontWeight: "600",
    width: 28,
    textAlign: "right",
  },
  breakdownBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  breakdownFill: {
    height: "100%",
    borderRadius: 4,
  },
  // Domain stats
  statsBlock: {
    flex: 1,
    justifyContent: "center",
    gap: 4,
    marginBottom: 10,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  statLabel: {
    fontSize: 11,
    flex: 1,
  },
  statValue: {
    fontSize: 11,
    fontWeight: "600",
  },
  // Shared progress row
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
  },
  percentage: {
    fontSize: 11,
    fontWeight: "600",
    minWidth: 30,
    textAlign: "right",
  },
});
