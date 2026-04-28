import React, { useState } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/src/contexts/ThemeContext";
import { DomainCard } from "@/components/goals/DomainCard";
import { buildDomainBreakdown } from "@/components/goals/DomainGrid";
import { TabSelector } from "@/components/goals/TabSelector";
import { BottomNav } from "@/components/navigation";
import { LandscapeHeader } from "@/components/LandscapeHeader";
import { mockDomainStats, mockAllStats, mockQuotes } from "@/data/mockData";

const TABS = [{ id: "domains", label: "DOMAINS" }];

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
        <LandscapeHeader quote={mockQuotes.metrics.quote} quoteAuthor={mockQuotes.metrics.author} />
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
