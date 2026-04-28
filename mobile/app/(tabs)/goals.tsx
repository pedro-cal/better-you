import React, { useState } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/src/contexts/ThemeContext";
import { TabSelector, DomainGrid, ActiveGoalsSection } from "@/components/goals";
import { BottomNav } from "@/components/navigation";
import { LandscapeHeader } from "@/components/LandscapeHeader";
import { mockDomainStats, mockAllStats, mockActiveGoals, mockQuotes } from "@/data/mockData";

const TABS = [
  { id: "goals", label: "GOALS" },
  { id: "journeys", label: "JOURNEYS" },
];

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
      case "metrics":
        router.push("/(tabs)/metrics");
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
        <LandscapeHeader quote={mockQuotes.goals.quote} quoteAuthor={mockQuotes.goals.author} />
        <TabSelector tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
        <ActiveGoalsSection goals={mockActiveGoals} />
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
