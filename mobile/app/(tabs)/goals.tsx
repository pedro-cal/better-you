import React, { useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { DomainStats, AllDomainStats } from "@better-you/shared";
import { TabSelector, WeeklyLoadCard, DomainGrid } from "@/components/goals";
import { BottomNav } from "@/components/navigation";

const TABS = [
  { id: "goals", label: "GOALS" },
  { id: "journeys", label: "JOURNEYS" },
];

// Mock data - replace with actual data from API/state
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
  const [activeTab, setActiveTab] = useState("goals");

  const handleNavPress = (item: string) => {
    switch (item) {
      case "goals":
        // Already on goals screen
        break;
      case "act":
        router.push("/(tabs)");
        break;
      // TODO: Add other navigation items when screens are created
      default:
        console.log(`Navigation to ${item} not yet implemented`);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TabSelector tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

        <WeeklyLoadCard percentage={65} title="Weekly Load" subtitle="Optimal capacity for mode" />

        <DomainGrid domainStats={mockDomainStats} allStats={mockAllStats} />
      </ScrollView>

      <BottomNav activeItem="goals" onItemPress={handleNavPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
});
