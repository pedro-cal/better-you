import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/contexts/ThemeContext";
import { Typography, Spacing, getCardStyle } from "@/constants/DesignTokens";
import type { LifeDomain } from "@better-you/shared";
import { DomainCarousel } from "@/components/goals/DomainCarousel";
import { ProgressPill } from "@/components/goals/ProgressPill";
import { useGoals } from "@/src/features/goals/useGoals";
import type { ColorScheme } from "@/constants/Colors";

export default function NewCustomGoalScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [selectedDomain, setSelectedDomain] = useState<LifeDomain | null>(null);
  const [title, setTitle] = useState("");
  const [intent, setIntent] = useState("");
  const [completionCriteria, setCompletionCriteria] = useState("");

  const { data: apiGoals = [] } = useGoals();
  const activeCount = apiGoals.filter((g) => g.state === "active").length;

  const canProceed = selectedDomain !== null && title.trim().length > 0;

  const handleNext = () => {
    if (!canProceed || !selectedDomain) return;
    router.push({
      pathname: "/goals/new-custom-steps",
      params: {
        domain: selectedDomain,
        title: title.trim(),
        intent: intent.trim(),
        completionCriteria: completionCriteria.trim(),
      },
    });
  };

  const s = styles(colors);

  return (
    <KeyboardAvoidingView
      style={[s.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Custom Goal</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Progress pill */}
      <View style={s.pillRow}>
        <ProgressPill stage={1} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Domain carousel */}
        <DomainCarousel selectedDomain={selectedDomain} onSelect={setSelectedDomain} />

        {/* Form card */}
        <View
          style={[
            s.formCard,
            getCardStyle("medium"),
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.cardBorderHighlight,
            },
          ]}
        >
          {/* Title */}
          <Text style={[s.fieldLabel, { color: colors.textTertiary }]}>WHAT IS YOUR GOAL?</Text>
          <TextInput
            style={[
              s.input,
              {
                backgroundColor: colors.cardBackgroundLight,
                borderColor: colors.border,
                color: colors.textPrimary,
              },
            ]}
            placeholder="e.g. Run a half-marathon, Learn Spanish…"
            placeholderTextColor={colors.textTertiary}
            value={title}
            onChangeText={setTitle}
            returnKeyType="next"
          />

          <View style={[s.divider, { backgroundColor: colors.border }]} />

          {/* Intent */}
          <Text style={[s.fieldLabel, { color: colors.textTertiary }]}>
            WHY DOES THIS MATTER TO YOU RIGHT NOW?
          </Text>
          <TextInput
            style={[
              s.input,
              s.textarea,
              {
                backgroundColor: colors.cardBackgroundLight,
                borderColor: colors.border,
                color: colors.textPrimary,
              },
            ]}
            placeholder="Optional — this is just for you"
            placeholderTextColor={colors.textTertiary}
            value={intent}
            onChangeText={setIntent}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
          <Text style={[s.fieldCaption, { color: colors.textTertiary }]}>
            Helps you stay connected to your reason when things get hard.
          </Text>

          <View style={[s.divider, { backgroundColor: colors.border }]} />

          {/* Completion criteria */}
          <Text style={[s.fieldLabel, { color: colors.textTertiary }]}>
            HOW WILL YOU KNOW YOU&apos;RE DONE?
          </Text>
          <TextInput
            style={[
              s.input,
              {
                backgroundColor: colors.cardBackgroundLight,
                borderColor: colors.border,
                color: colors.textPrimary,
              },
            ]}
            placeholder="e.g. Complete a 21km race…"
            placeholderTextColor={colors.textTertiary}
            value={completionCriteria}
            onChangeText={setCompletionCriteria}
            returnKeyType="done"
          />

          <View style={[s.divider, { backgroundColor: colors.border }]} />

          {/* Journey row — static until journeys endpoint is built */}
          <TouchableOpacity style={s.journeyRow} activeOpacity={0.7} disabled>
            <Ionicons name="git-branch-outline" size={18} color={colors.textTertiary} />
            <Text style={[s.journeyLabel, { color: colors.textSecondary }]}>No journey</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
          </TouchableOpacity>
          <Text style={[s.fieldCaption, { color: colors.textTertiary }]}>
            Domain must match your goal.
          </Text>
        </View>

        {/* Overload strip */}
        <View
          style={[
            s.overloadStrip,
            {
              backgroundColor: activeCount === 0 ? `${colors.primary}14` : "#C8A96E18",
              borderColor: activeCount === 0 ? `${colors.primary}33` : "#C8A96E44",
            },
          ]}
        >
          <Ionicons
            name={activeCount === 0 ? "checkmark-circle-outline" : "stats-chart-outline"}
            size={16}
            color={activeCount === 0 ? colors.primary : "#C8A96E"}
          />
          <Text style={[s.overloadText, { color: activeCount === 0 ? colors.primary : "#C8A96E" }]}>
            {activeCount === 0
              ? "Nothing active yet — a great time to start."
              : `You have ${activeCount} active goal${activeCount > 1 ? "s" : ""} — system will recommend queued or active.`}
          </Text>
        </View>

        <View style={{ height: insets.bottom + 100 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[s.ctaContainer, { paddingBottom: insets.bottom + Spacing.lg }]}>
        <TouchableOpacity
          style={[
            s.ctaButton,
            { backgroundColor: canProceed ? colors.primary : colors.cardBackgroundLight },
          ]}
          onPress={handleNext}
          disabled={!canProceed}
          activeOpacity={0.85}
        >
          <Text
            style={[s.ctaText, { color: canProceed ? colors.background : colors.textTertiary }]}
          >
            Next: Add Steps →
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: Spacing.xxl,
      paddingVertical: Spacing.lg,
    },
    headerTitle: { ...Typography.title3, color: colors.textPrimary },
    pillRow: { paddingBottom: Spacing.xl },
    scroll: { paddingTop: Spacing.xs },
    formCard: {
      marginHorizontal: Spacing.xxl,
      marginTop: Spacing.xxl,
      padding: Spacing.lg,
      gap: Spacing.sm,
    },
    fieldLabel: { ...Typography.body3, letterSpacing: 0.8 },
    input: {
      borderRadius: 10,
      borderWidth: 1,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm + 2,
      fontSize: 15,
    },
    textarea: { height: 80, paddingTop: Spacing.sm },
    fieldCaption: { fontSize: 11, fontWeight: "400" },
    divider: { height: 1, marginVertical: Spacing.xs },
    journeyRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
      paddingVertical: Spacing.xs,
    },
    journeyLabel: { flex: 1, fontSize: 15 },
    overloadStrip: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
      marginHorizontal: Spacing.xxl,
      marginTop: Spacing.lg,
      padding: Spacing.md,
      borderRadius: 10,
      borderWidth: 1,
    },
    overloadText: { flex: 1, fontSize: 13, fontWeight: "500" },
    ctaContainer: {
      paddingHorizontal: Spacing.xxl,
      paddingTop: Spacing.md,
      backgroundColor: colors.background,
    },
    ctaButton: { borderRadius: 14, paddingVertical: 18, alignItems: "center" },
    ctaText: { ...Typography.body1, fontSize: 16 },
  });
