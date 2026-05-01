import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/contexts/ThemeContext";
import { Typography, Spacing, getCardStyle } from "@/constants/DesignTokens";
import type { LifeDomain } from "@better-you/shared";
import { DOMAIN_ICONS } from "@/components/goals/DomainGrid";
import { DomainIcon } from "@/components/goals/DomainCard";
import { ProgressPill } from "@/components/goals/ProgressPill";
import { StepCard, makeStep, type StepDraft } from "@/components/goals/StepCard";
import { apiFetch } from "@/src/lib/apiClient";
import { queryClient } from "@/src/state/query";
import type { ApiGoal } from "@/src/features/goals/useGoals";
import type { ColorScheme } from "@/constants/Colors";

const DOMAIN_LABELS: Record<LifeDomain, string> = {
  BODY: "Body",
  MIND: "Mind",
  SOCIAL: "Relationships",
  WORK: "Work",
  MONEY: "Money",
  SERVICE: "Service",
  SPIRITUALITY: "Spirituality",
};

export default function NewCustomStepsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    domain: string;
    title: string;
    intent: string;
    completionCriteria: string;
  }>();

  const domain = (params.domain ?? "BODY") as LifeDomain;
  const title = params.title ?? "";
  const intent = params.intent ?? "";
  const completionCriteria = params.completionCriteria ?? "";

  const [steps, setSteps] = useState<StepDraft[]>([makeStep()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const weeklyMinutes = steps.reduce((sum, s) => {
    if (s.type === "one_time") return sum;
    if (s.isDaily) return sum + s.estimatedMinutes * 7;
    return sum + s.estimatedMinutes * (s.allowedWeekdays.length || 1);
  }, 0);

  const weeklyCommitment =
    weeklyMinutes >= 60
      ? `${(weeklyMinutes / 60).toFixed(1).replace(".0", "")} hrs`
      : `${weeklyMinutes} min`;

  const updateStep = (localId: string, patch: Partial<StepDraft>) =>
    setSteps((prev) => prev.map((s) => (s.localId === localId ? { ...s, ...patch } : s)));

  const removeStep = (localId: string) =>
    setSteps((prev) => prev.filter((s) => s.localId !== localId));

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const { data: createResult } = await apiFetch<{
        goal: ApiGoal;
        overload: { utilization: number; recommendedState: string };
      }>("/api/goals", {
        method: "POST",
        body: JSON.stringify({
          domain,
          title,
          intent: intent || undefined,
          completionCriteria: completionCriteria || undefined,
        }),
      });

      const goalId = createResult.goal.id;
      const recommendedState = createResult.overload.recommendedState ?? "active";
      await apiFetch(`/api/goals/${goalId}/transition`, {
        method: "POST",
        body: JSON.stringify({ to: recommendedState }),
      });

      const validSteps = steps.filter((s) => s.title.trim().length > 0);
      for (let i = 0; i < validSteps.length; i++) {
        const s = validSteps[i];
        const body: Record<string, unknown> = {
          title: s.title.trim(),
          type: s.type,
          estimatedMinutes: s.estimatedMinutes || undefined,
          order: i,
        };
        if (s.type === "recurring") {
          body.cadence = s.isDaily ? "daily" : "custom";
          if (!s.isDaily && s.allowedWeekdays.length > 0) {
            body.allowedWeekdays = s.allowedWeekdays;
          }
        }
        await apiFetch(`/api/goals/${goalId}/steps`, {
          method: "POST",
          body: JSON.stringify(body),
        });
      }

      await queryClient.invalidateQueries({ queryKey: ["goals"] });
      router.replace("/(tabs)/goals");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const s = styles(colors);
  const iconDef = DOMAIN_ICONS[domain];

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

      <View style={s.pillRow}>
        <ProgressPill stage={2} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Goal recap chip */}
        <View
          style={[
            s.recapCard,
            getCardStyle("small"),
            { backgroundColor: colors.cardBackground, borderColor: colors.cardBorderHighlight },
          ]}
        >
          <View style={[s.recapIconWrap, { backgroundColor: colors.cardBackgroundLight }]}>
            <DomainIcon iconDef={iconDef} size={18} color={colors.primary} />
          </View>
          <View style={s.recapText}>
            <Text style={[s.recapTitle, { color: colors.textPrimary }]} numberOfLines={1}>
              {title}
            </Text>
            <Text style={[s.recapDomain, { color: colors.textTertiary }]}>
              {DOMAIN_LABELS[domain]}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={[s.editLink, { color: colors.textTertiary }]}>Edit</Text>
          </TouchableOpacity>
        </View>

        <Text style={[s.sectionLabel, { color: colors.textTertiary }]}>BUILD YOUR PATH</Text>
        <Text style={[s.sectionCaption, { color: colors.textTertiary }]}>
          Define the actions that will move you forward. You can always adjust later.
        </Text>

        {steps.map((step, index) => (
          <StepCard
            key={step.localId}
            step={step}
            index={index}
            showDelete={steps.length > 1}
            onUpdate={(patch) => updateStep(step.localId, patch)}
            onRemove={() => removeStep(step.localId)}
          />
        ))}

        <TouchableOpacity
          style={[s.addStepButton, { borderColor: colors.border }]}
          onPress={() => setSteps((prev) => [...prev, makeStep()])}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={18} color={colors.textSecondary} />
          <Text style={[s.addStepText, { color: colors.textSecondary }]}>Add another step</Text>
        </TouchableOpacity>

        {weeklyMinutes > 0 && (
          <View
            style={[
              s.commitStrip,
              { backgroundColor: colors.cardBackground, borderColor: colors.border },
            ]}
          >
            <Ionicons name="trending-up-outline" size={16} color={colors.textSecondary} />
            <Text style={[s.commitText, { color: colors.textSecondary }]}>
              Est. weekly commitment:{" "}
              <Text style={{ color: colors.textPrimary, fontWeight: "700" }}>
                {weeklyCommitment}
              </Text>
            </Text>
          </View>
        )}

        {error && <Text style={[s.errorText, { color: "#E57373" }]}>{error}</Text>}

        <Text style={[s.skipNote, { color: colors.textTertiary }]}>
          Steps can be skipped — you can add them from the goal page.
        </Text>

        <View style={{ height: insets.bottom + 100 }} />
      </ScrollView>

      <View style={[s.ctaContainer, { paddingBottom: insets.bottom + Spacing.lg }]}>
        <TouchableOpacity
          style={[
            s.ctaButton,
            { backgroundColor: colors.primary, opacity: isSubmitting ? 0.6 : 1 },
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
          activeOpacity={0.85}
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={[s.ctaText, { color: colors.background }]}>Create Goal →</Text>
          )}
        </TouchableOpacity>
        <Text style={[s.ctaCaption, { color: colors.textTertiary }]}>
          You&apos;ll confirm whether to activate or queue on the next step.
        </Text>
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
    scroll: { paddingHorizontal: Spacing.xxl, paddingTop: Spacing.xs },
    recapCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.md,
      padding: Spacing.md,
      marginBottom: Spacing.xxl,
    },
    recapIconWrap: {
      width: 38,
      height: 38,
      borderRadius: 9,
      alignItems: "center",
      justifyContent: "center",
    },
    recapText: { flex: 1 },
    recapTitle: { ...Typography.body1 },
    recapDomain: { ...Typography.body3, letterSpacing: 0, fontWeight: "400" },
    editLink: { fontSize: 13, fontWeight: "500" },
    sectionLabel: { ...Typography.body3, letterSpacing: 1, marginBottom: Spacing.xs },
    sectionCaption: { fontSize: 13, fontWeight: "400", marginBottom: Spacing.lg },
    addStepButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: Spacing.sm,
      borderWidth: 1,
      borderStyle: "dashed",
      borderRadius: 12,
      paddingVertical: 14,
      marginBottom: Spacing.md,
    },
    addStepText: { fontSize: 14, fontWeight: "500" },
    commitStrip: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.sm,
      padding: Spacing.md,
      borderRadius: 10,
      borderWidth: 1,
      marginBottom: Spacing.md,
    },
    commitText: { fontSize: 13 },
    errorText: { fontSize: 13, marginBottom: Spacing.sm },
    skipNote: { fontSize: 12, textAlign: "center", marginBottom: Spacing.sm },
    ctaContainer: {
      paddingHorizontal: Spacing.xxl,
      paddingTop: Spacing.md,
      backgroundColor: colors.background,
    },
    ctaButton: {
      borderRadius: 14,
      paddingVertical: 18,
      alignItems: "center",
      marginBottom: Spacing.sm,
    },
    ctaText: { ...Typography.body1, fontSize: 16 },
    ctaCaption: { fontSize: 12, fontWeight: "400", textAlign: "center" },
  });
