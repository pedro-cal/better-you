import React from "react";
import { View, StyleSheet } from "react-native";
import { DomainCard } from "./DomainCard";
import { DomainStats, AllDomainStats, LifeDomain } from "@better-you/shared";

// Icon names from Ionicons for each domain
export const DOMAIN_ICONS: Record<LifeDomain, string> = {
  BODY: "fitness",
  MIND: "bulb",
  RELATIONSHIPS: "heart",
  WORK: "briefcase",
  MONEY: "cash",
  SERVICE: "hand-left",
  SPIRITUALITY: "leaf",
};

const DOMAIN_NAMES: Record<LifeDomain, string> = {
  BODY: "Body",
  MIND: "Mind",
  RELATIONSHIPS: "Relationships",
  WORK: "Work",
  MONEY: "Money",
  SERVICE: "Service",
  SPIRITUALITY: "Spirituality",
};

interface DomainGridProps {
  domainStats: DomainStats[];
  allStats: AllDomainStats;
}

export function DomainGrid({ domainStats, allStats }: DomainGridProps) {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {/* Summary Card First */}
        <View style={styles.cardWrapper}>
          <DomainCard
            activeGoals={allStats.totalActiveGoals}
            completionPercentage={allStats.overallCompletion}
            isSummary
          />
        </View>

        {/* Domain Cards */}
        {domainStats.map((stat) => (
          <View key={stat.domain} style={styles.cardWrapper}>
            <DomainCard
              domain={stat.domain}
              domainName={DOMAIN_NAMES[stat.domain]}
              activeGoals={stat.activeGoals}
              completionPercentage={stat.completionPercentage}
              iconName={DOMAIN_ICONS[stat.domain]}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },
  cardWrapper: {
    width: "50%",
    padding: 6,
  },
});
