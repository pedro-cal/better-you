import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
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
import { apiFetch } from "@/src/lib/apiClient";
import { queryClient } from "@/src/state/query";
import type { ApiGoal } from "@better-you/shared";
import type { ColorScheme } from "@/constants/Colors";

const VALID_TRANSITIONS: Record<string, string[]> = {
  draft: ["queued", "active", "abandoned"],
  queued: ["active", "abandoned"],
  active: ["paused", "completed", "abandoned"],
  paused: ["active", "abandoned"],
  completed: [],
  abandoned: [],
  archived: [],
};

const STATE_LABELS: Record<string, string> = {
  draft: "Draft",
  queued: "Queued",
  active: "Active",
  paused: "Paused",
  completed: "Completed",
  abandoned: "Abandoned",
  archived: "Archived",
};

export default function GoalEditScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [goal, setGoal] = useState<ApiGoal | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [intent, setIntent] = useState("");
  const [completionCriteria, setCompletionCriteria] = useState("");

  useEffect(() => {
    if (!id) return;
    apiFetch<ApiGoal>(`/api/goals/${id}`)
      .then((r) => {
        setGoal(r.data);
        setTitle(r.data.title);
        setIntent(r.data.intent ?? "");
        setCompletionCriteria(r.data.completionCriteria ?? "");
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const isDirty =
    title.trim() !== (goal?.title ?? "") ||
    intent.trim() !== (goal?.intent ?? "") ||
    completionCriteria.trim() !== (goal?.completionCriteria ?? "");

  const handleSave = async () => {
    if (!goal || !isDirty) return;
    setSaving(true);
    setError(null);
    try {
      const { data: updated } = await apiFetch<ApiGoal>(`/api/goals/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: title.trim(),
          intent: intent.trim() || null,
          completionCriteria: completionCriteria.trim() || null,
        }),
      });
      setGoal(updated);
      await queryClient.invalidateQueries({ queryKey: ["goals"] });
      router.back();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleTransition = async (to: string) => {
    if (!goal) return;
    setTransitioning(true);
    setError(null);
    try {
      const { data: updated } = await apiFetch<ApiGoal>(`/api/goals/${id}/transition`, {
        method: "POST",
        body: JSON.stringify({ to }),
      });
      setGoal(updated);
      await queryClient.invalidateQueries({ queryKey: ["goals"] });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Transition failed");
    } finally {
      setTransitioning(false);
    }
  };

  const s = styles(colors);

  if (loading) {
    return (
      <View style={[s.loadingContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!goal) {
    return (
      <View style={[s.loadingContainer, { paddingTop: insets.top }]}>
        <Text style={[s.errorText, { color: colors.textTertiary }]}>Goal not found.</Text>
      </View>
    );
  }

  const availableTransitions = VALID_TRANSITIONS[goal.state] ?? [];

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
        <Text style={s.headerTitle}>Edit Goal</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* State row */}
        <View style={s.stateRow}>
          <Text style={[s.stateLabel, { color: colors.textTertiary }]}>Status</Text>
          <View
            style={[
              s.stateBadge,
              { backgroundColor: `${colors.primary}18`, borderColor: `${colors.primary}33` },
            ]}
          >
            <Text style={[s.stateBadgeText, { color: colors.primary }]}>
              {STATE_LABELS[goal.state] ?? goal.state}
            </Text>
          </View>
        </View>

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
          <Text style={[s.fieldLabel, { color: colors.textTertiary }]}>GOAL</Text>
          <TextInput
            style={[
              s.input,
              {
                backgroundColor: colors.cardBackgroundLight,
                borderColor: colors.border,
                color: colors.textPrimary,
              },
            ]}
            value={title}
            onChangeText={setTitle}
            placeholderTextColor={colors.textTertiary}
            returnKeyType="next"
          />

          <View style={[s.divider, { backgroundColor: colors.border }]} />

          <Text style={[s.fieldLabel, { color: colors.textTertiary }]}>WHY IT MATTERS</Text>
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
            placeholder="Optional"
            placeholderTextColor={colors.textTertiary}
            value={intent}
            onChangeText={setIntent}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          <View style={[s.divider, { backgroundColor: colors.border }]} />

          <Text style={[s.fieldLabel, { color: colors.textTertiary }]}>DONE WHEN</Text>
          <TextInput
            style={[
              s.input,
              {
                backgroundColor: colors.cardBackgroundLight,
                borderColor: colors.border,
                color: colors.textPrimary,
              },
            ]}
            placeholder="Optional"
            placeholderTextColor={colors.textTertiary}
            value={completionCriteria}
            onChangeText={setCompletionCriteria}
            returnKeyType="done"
          />
        </View>

        {/* State transitions */}
        {availableTransitions.length > 0 && (
          <View
            style={[
              s.transitionCard,
              getCardStyle("small"),
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.cardBorderHighlight,
              },
            ]}
          >
            <Text style={[s.fieldLabel, { color: colors.textTertiary }]}>MOVE TO</Text>
            <View style={s.chipRow}>
              {availableTransitions.map((to) => (
                <TouchableOpacity
                  key={to}
                  onPress={() => handleTransition(to)}
                  disabled={transitioning}
                  style={[
                    s.chip,
                    {
                      backgroundColor: colors.cardBackgroundLight,
                      borderColor: colors.border,
                      opacity: transitioning ? 0.5 : 1,
                    },
                  ]}
                >
                  <Text style={[s.chipText, { color: colors.textSecondary }]}>
                    {STATE_LABELS[to]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {error && <Text style={[s.errorText, { color: "#E57373" }]}>{error}</Text>}

        <View style={{ height: insets.bottom + 100 }} />
      </ScrollView>

      {/* Save CTA */}
      <View style={[s.ctaContainer, { paddingBottom: insets.bottom + Spacing.lg }]}>
        <TouchableOpacity
          style={[
            s.ctaButton,
            {
              backgroundColor: isDirty ? colors.primary : colors.cardBackgroundLight,
              opacity: saving ? 0.6 : 1,
            },
          ]}
          onPress={handleSave}
          disabled={!isDirty || saving}
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={[s.ctaText, { color: isDirty ? colors.background : colors.textTertiary }]}>
              Save Changes
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    loadingContainer: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "center",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: Spacing.xxl,
      paddingVertical: Spacing.lg,
    },
    headerTitle: { ...Typography.title3, color: colors.textPrimary },
    scroll: { paddingHorizontal: Spacing.xxl, paddingTop: Spacing.xs },
    stateRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: Spacing.lg,
    },
    stateLabel: { ...Typography.body2 },
    stateBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 6,
      borderWidth: 1,
    },
    stateBadgeText: { ...Typography.body3, fontWeight: "600", letterSpacing: 0.5 },
    formCard: {
      padding: Spacing.lg,
      gap: Spacing.sm,
      marginBottom: Spacing.lg,
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
    divider: { height: 1, marginVertical: Spacing.xs },
    transitionCard: {
      padding: Spacing.lg,
      gap: Spacing.sm,
      marginBottom: Spacing.lg,
    },
    chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
    chipText: { fontSize: 13, fontWeight: "600" },
    errorText: { fontSize: 13, marginVertical: Spacing.sm },
    ctaContainer: {
      paddingHorizontal: Spacing.xxl,
      paddingTop: Spacing.md,
      backgroundColor: colors.background,
    },
    ctaButton: { borderRadius: 14, paddingVertical: 18, alignItems: "center" },
    ctaText: { ...Typography.body1, fontSize: 16 },
  });
