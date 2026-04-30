import React from "react";
import { StyleSheet, ScrollView, View, ActivityIndicator, Text } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/src/contexts/ThemeContext";
import { ProgressBar, NextStepCard, TodaySteps } from "@/components/home";
import { BottomNav } from "@/components/navigation";
import { LandscapeHeader } from "@/components/LandscapeHeader";
import { mockQuotes } from "@/data/mockData";
import { useCheckins } from "@/src/features/checkins/useCheckins";
import { useSubmitCheckin } from "@/src/features/checkins/useSubmitCheckin";
import type { Step } from "@better-you/shared";

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { data: todaySteps = [], isLoading } = useCheckins();
  const { mutate: submitCheckin } = useSubmitCheckin();

  const completed = todaySteps.filter((s) => s.status === "DONE" || s.status === "SKIPPED").length;
  const total = todaySteps.length;
  const nextStep = todaySteps.find((s) => s.status === "TODO" || s.status === "IN_PROGRESS");

  const handleStepAction = (action: string) => {
    if (!nextStep) return;
    submitCheckin({ stepId: nextStep.id, status: action === "skip" ? "skipped" : "done" });
  };

  const handleStepPress = (step: Step) => {
    console.log(`Step pressed: ${step.title}`);
  };

  const handleNavPress = (item: string) => {
    switch (item) {
      case "goals":
        router.push("/(tabs)/goals");
        break;
      case "act":
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
        <LandscapeHeader quote={mockQuotes.home.quote} quoteAuthor={mockQuotes.home.author} />
        {isLoading ? (
          <ActivityIndicator style={styles.loader} color={colors.primary} />
        ) : total === 0 ? (
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
              No active goals yet. Head to Goals to get started.
            </Text>
          </View>
        ) : (
          <>
            <ProgressBar completed={completed} total={total} />
            {nextStep ? (
              <NextStepCard
                step={nextStep}
                onDone={() => handleStepAction("done")}
                onPartial={() => handleStepAction("done")}
                onSkip={() => handleStepAction("skip")}
              />
            ) : (
              <View style={styles.allDone}>
                <Text style={[styles.allDoneText, { color: colors.textSecondary }]}>
                  All steps done for today
                </Text>
              </View>
            )}
            <TodaySteps steps={todaySteps} onStepPress={handleStepPress} />
          </>
        )}
      </ScrollView>
      <BottomNav activeItem="act" onItemPress={handleNavPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 120 },
  loader: { marginTop: 40 },
  allDone: { alignItems: "center", paddingVertical: 32, paddingHorizontal: 24 },
  allDoneText: { fontSize: 16, textAlign: "center" },
  empty: { alignItems: "center", paddingVertical: 40, paddingHorizontal: 32 },
  emptyText: { fontSize: 15, textAlign: "center", lineHeight: 22 },
});
