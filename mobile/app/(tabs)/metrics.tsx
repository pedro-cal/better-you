import React, { useState } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/src/contexts/ThemeContext";
import { DomainStats, AllDomainStats } from "@better-you/shared";
import { DomainCard } from "@/components/goals/DomainCard";
import { buildDomainBreakdown } from "@/components/goals/DomainGrid";
import { TabSelector } from "@/components/goals/TabSelector";
import { BottomNav } from "@/components/navigation";
import { LandscapeHeader } from "@/components/LandscapeHeader";

const TABS = [{ id: "domains", label: "DOMAINS" }];

const mockDomainStats: DomainStats[] = [
  { domain: "BODY", activeGoals: 5, completionPercentage: 75, onTrack: 3, drifting: 1, atRisk: 1 },
  { domain: "MIND", activeGoals: 3, completionPercentage: 60, onTrack: 2, drifting: 1, atRisk: 0 },
  {
    domain: "SOCIAL",
    activeGoals: 2,
    completionPercentage: 50,
    onTrack: 1,
    drifting: 0,
    atRisk: 1,
  },
  { domain: "WORK", activeGoals: 4, completionPercentage: 80, onTrack: 3, drifting: 1, atRisk: 0 },
  { domain: "MONEY", activeGoals: 1, completionPercentage: 40, onTrack: 0, drifting: 1, atRisk: 0 },
  {
    domain: "SERVICE",
    activeGoals: 2,
    completionPercentage: 90,
    onTrack: 2,
    drifting: 0,
    atRisk: 0,
  },
  {
    domain: "SPIRITUALITY",
    activeGoals: 3,
    completionPercentage: 65,
    onTrack: 2,
    drifting: 0,
    atRisk: 1,
  },
];

const mockAllStats: AllDomainStats = {
  totalActiveGoals: 20,
  overallCompletion: 67,
  onTrack: 13,
  drifting: 4,
  atRisk: 3,
};

export default function MetricsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState("domains");

  const handleNavPress = (item: string) => {
    switch (item) {
      case "act":
        router.push("/(tabs)");
        break;
      case "goals":
        router.push("/(tabs)/goals");
        break;
      default:
        console.log(`Navigation to ${item} not yet implemented`);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <LandscapeHeader quote="What gets measured gets managed." quoteAuthor="Peter Drucker" />
        <TabSelector tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "domains" && (
          <View style={styles.content}>
            <DomainCard
              activeGoals={mockAllStats.totalActiveGoals}
              completionPercentage={mockAllStats.overallCompletion}
              onTrack={mockAllStats.onTrack}
              drifting={mockAllStats.drifting}
              atRisk={mockAllStats.atRisk}
              domainBreakdown={buildDomainBreakdown(mockDomainStats)}
              isSummary
            />
          </View>
        )}
      </ScrollView>
      <BottomNav activeItem="metrics" onItemPress={handleNavPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 120 },
  content: { paddingHorizontal: 24, marginTop: 24 },
});
