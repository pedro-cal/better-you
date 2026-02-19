import React from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { Step } from "@better-you/shared";
import { useTheme } from "@/src/contexts/ThemeContext";
import { ProgressBar, NextStepCard, TodaySteps } from "@/components/home";
import { BottomNav } from "@/components/navigation";
import { LandscapeHeader } from "@/components/LandscapeHeader";

// Mock data - replace with actual data from API/state
const mockNextStep: Step = {
  id: "1",
  title: "45m Study for certification",
  goalTitle: "Certification Prep",
  duration: "4/30",
  progress: 13,
  status: "IN_PROGRESS",
};

const mockTodaySteps: Step[] = [
  {
    id: "2",
    title: "30m read latest book",
    status: "IN_PROGRESS",
    progress: 45,
  },
  {
    id: "3",
    title: "30m ride the bike",
    status: "DONE",
    completionCount: 17,
  },
  {
    id: "4",
    title: "15m Meditation",
    status: "TODO",
  },
  {
    id: "5",
    title: "Review Weekly Goals",
    status: "TODO",
  },
  {
    id: "6",
    title: "Prep Meals for Tmrw",
    status: "TODO",
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const handleStepAction = (action: string) => {
    console.log(`Step action: ${action}`);
    // TODO: Implement step action logic
  };

  const handleStepPress = (step: Step) => {
    console.log(`Step pressed: ${step.title}`);
    // TODO: Navigate to step detail
  };

  const handleNavPress = (item: string) => {
    switch (item) {
      case "goals":
        router.push("/(tabs)/goals");
        break;
      case "act":
        // Already on act screen
        break;
      // TODO: Add other navigation items when screens are created
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
        <ProgressBar completed={1} total={4} />
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
