import React, { useState } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/src/contexts/ThemeContext";
import { DomainStats, AllDomainStats } from "@better-you/shared";
import { TabSelector, DomainGrid } from "@/components/goals";
import { BottomNav } from "@/components/navigation";
import { LandscapeHeader } from "@/components/LandscapeHeader";

const TABS = [
  { id: "goals", label: "GOALS" },
  { id: "journeys", label: "JOURNEYS" },
];

const mockDomainStats: DomainStats[] = [
  { domain: "BODY", activeGoals: 5, completionPercentage: 75 },
  { domain: "MIND", activeGoals: 3, completionPercentage: 60 },
  { domain: "RELATIONSHIPS", activeGoals: 2, completionPercentage: 50 },
  { domain: "WORK", activeGoals: 4, completionPercentage: 80 },
  { domain: "MONEY", activeGoals: 1, completionPercentage: 40 },
  { domain: "SERVICE", activeGoals: 2, completionPercentage: 90 },
  { domain: "SPIRITUALITY", activeGoals: 3, completionPercentage: 65 },
];

const mockAllStats: AllDomainStats = {
  totalActiveGoals: 20,
  overallCompletion: 67,
};

export default function GoalsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState("goals");

  const handleNavPress = (item: string) => {
    switch (item) {
      case "goals":
        break;
      case "act":
        router.push("/(tabs)");
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
        <LandscapeHeader
          quote="The secret of getting ahead is getting started."
          quoteAuthor="Mark Twain"
        />
        <TabSelector tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
        <DomainGrid domainStats={mockDomainStats} allStats={mockAllStats} />
      </ScrollView>
      <BottomNav activeItem="goals" onItemPress={handleNavPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
});
