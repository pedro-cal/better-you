import React, { useState, useCallback } from "react";
import { StyleSheet, ScrollView, View, ActivityIndicator, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/contexts/ThemeContext";
import { TabSelector, DomainGrid, ActiveGoalsSection } from "@/components/goals";
import { BottomNav } from "@/components/navigation";
import { LandscapeHeader } from "@/components/LandscapeHeader";
import { mockQuotes } from "@/data/mockData";
import {
  useGoals,
  toGoal,
  computeDomainStats,
  computeAllStats,
} from "@/src/features/goals/useGoals";
import { useJourneys, toJourneyAsGoal } from "@/src/features/goals/useJourneys";

const TABS = [
  { id: "goals", label: "GOALS" },
  { id: "journeys", label: "JOURNEYS" },
];

export default function GoalsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState("goals");
  const { data: apiGoals = [], isLoading: goalsLoading, refetch: refetchGoals } = useGoals();
  const {
    data: apiJourneys = [],
    isLoading: journeysLoading,
    refetch: refetchJourneys,
  } = useJourneys();

  useFocusEffect(
    useCallback(() => {
      refetchGoals();
      refetchJourneys();
    }, [refetchGoals, refetchJourneys]),
  );

  const isLoading = goalsLoading || journeysLoading;

  const visibleGoals = apiGoals
    .filter((g) => g.journeyId === null && ["active", "queued", "draft"].includes(g.state))
    .map(toGoal);

  const inactiveGoals = apiGoals
    .filter((g) => g.journeyId === null && ["paused", "completed", "abandoned"].includes(g.state))
    .map(toGoal);

  const visibleJourneys = apiJourneys.filter((j) => j.state !== "archived").map(toJourneyAsGoal);

  const domainStats = computeDomainStats(apiGoals.filter((g) => g.journeyId === null));
  const allStats = computeAllStats(apiGoals.filter((g) => g.journeyId === null));

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
        {isLoading ? (
          <ActivityIndicator style={styles.loader} color={colors.primary} />
        ) : activeTab === "journeys" ? (
          <ActiveGoalsSection goals={visibleJourneys} sectionTitle="Active Journeys" />
        ) : (
          <>
            <ActiveGoalsSection goals={visibleGoals} />
            {inactiveGoals.length > 0 && (
              <ActiveGoalsSection
                goals={inactiveGoals}
                sectionTitle="Inactive Goals"
                countLabel="INACTIVE"
                dotColor={colors.textTertiary}
              />
            )}
            {domainStats.length > 0 && <DomainGrid domainStats={domainStats} allStats={allStats} />}
          </>
        )}
      </ScrollView>
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() =>
          router.push(activeTab === "journeys" ? "/goals/new-journey" : "/goals/new-custom")
        }
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={26} color={colors.background} />
      </TouchableOpacity>
      <BottomNav activeItem="goals" onItemPress={handleNavPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 120 },
  loader: { marginTop: 40 },
  fab: {
    position: "absolute",
    bottom: 88,
    right: 24,
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    zIndex: 10,
  },
});
