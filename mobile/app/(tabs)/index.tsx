import React from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/src/contexts/ThemeContext";
import { ProgressBar, NextStepCard, TodaySteps } from "@/components/home";
import { BottomNav } from "@/components/navigation";
import { LandscapeHeader } from "@/components/LandscapeHeader";
import { mockNextStep, mockTodaySteps, mockDailyProgress, mockQuotes } from "@/data/mockData";

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const handleStepAction = (action: string) => {
    console.log(`Step action: ${action}`);
    // TODO: Implement step action logic
  };

  const handleStepPress = (step: { title: string }) => {
    console.log(`Step pressed: ${step.title}`);
    // TODO: Navigate to step detail
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
        <ProgressBar completed={mockDailyProgress.completed} total={mockDailyProgress.total} />
        <NextStepCard
          step={mockNextStep}
          onDone={() => handleStepAction("done")}
          onPartial={() => handleStepAction("partial")}
          onSkip={() => handleStepAction("skip")}
        />
        <TodaySteps steps={mockTodaySteps} onStepPress={handleStepPress} />
      </ScrollView>
      <BottomNav activeItem="act" onItemPress={handleNavPress} />
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
