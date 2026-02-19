import React from "react";
import { View, StyleSheet } from "react-native";
import { DomainCard, DomainBreakdownItem } from "./DomainCard";
import { DomainStats, AllDomainStats, LifeDomain } from "@better-you/shared";

export type DomainIconDef =
  | { library: "Ionicons"; name: string }
  | { library: "FontAwesome5"; name: string };

export const DOMAIN_ICONS: Record<LifeDomain, DomainIconDef> = {
  BODY: { library: "Ionicons", name: "fitness" },
  MIND: { library: "FontAwesome5", name: "brain" },
  SOCIAL: { library: "FontAwesome5", name: "users" },
  WORK: { library: "Ionicons", name: "briefcase" },
  MONEY: { library: "Ionicons", name: "logo-usd" },
  SERVICE: { library: "FontAwesome5", name: "hands-helping" },
  SPIRITUALITY: { library: "FontAwesome5", name: "pray" },
};

const DOMAIN_NAMES: Record<LifeDomain, string> = {
  BODY: "Body",
  MIND: "Mind",
  SOCIAL: "Social",
  WORK: "Work",
  MONEY: "Money",
  SERVICE: "Service",
  SPIRITUALITY: "Spirituality",
};

export function buildDomainBreakdown(domainStats: DomainStats[]): DomainBreakdownItem[] {
  return domainStats.map((stat) => ({
    domain: stat.domain,
    iconDef: DOMAIN_ICONS[stat.domain],
    onTrack: stat.onTrack,
    activeGoals: stat.activeGoals,
  }));
}

interface DomainGridProps {
  domainStats: DomainStats[];
  allStats: AllDomainStats;
}

export function DomainGrid({ domainStats, allStats }: DomainGridProps) {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {/* Domain Cards */}
        {domainStats.map((stat) => (
          <View key={stat.domain} style={styles.cardWrapper}>
            <DomainCard
              domain={stat.domain}
              domainName={DOMAIN_NAMES[stat.domain]}
              activeGoals={stat.activeGoals}
              completionPercentage={stat.completionPercentage}
              onTrack={stat.onTrack}
              drifting={stat.drifting}
              atRisk={stat.atRisk}
              iconDef={DOMAIN_ICONS[stat.domain]}
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
  fullWidthWrapper: {
    width: "100%",
    padding: 6,
  },
});
