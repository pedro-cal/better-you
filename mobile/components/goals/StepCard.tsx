import React from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/contexts/ThemeContext";
import { Typography, Spacing, getCardStyle } from "@/constants/DesignTokens";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import type { ColorScheme } from "@/constants/Colors";

export const DURATION_PRESETS = [15, 30, 45, 60] as const;

export const WEEKDAYS = [
  { value: "Mon", label: "M" },
  { value: "Tue", label: "T" },
  { value: "Wed", label: "W" },
  { value: "Thu", label: "T" },
  { value: "Fri", label: "F" },
  { value: "Sat", label: "S" },
  { value: "Sun", label: "S" },
] as const;

export interface StepDraft {
  /** Local draft ID (not the backend step ID) */
  localId: string;
  /** Backend ID — present only for persisted steps */
  stepId?: string;
  title: string;
  type: "recurring" | "one_time";
  estimatedMinutes: number;
  isDaily: boolean;
  allowedWeekdays: string[];
}

export function makeStep(): StepDraft {
  return {
    localId: Math.random().toString(36).slice(2),
    title: "",
    type: "recurring",
    estimatedMinutes: 15,
    isDaily: true,
    allowedWeekdays: [],
  };
}

interface Props {
  step: StepDraft;
  index: number;
  showDelete: boolean;
  onUpdate: (patch: Partial<StepDraft>) => void;
  onRemove: () => void;
}

export function StepCard({ step, index, showDelete, onUpdate, onRemove }: Props) {
  const { colors } = useTheme();
  const s = styles(colors);

  const toggleWeekday = (day: string) => {
    const next = step.allowedWeekdays.includes(day)
      ? step.allowedWeekdays.filter((d) => d !== day)
      : [...step.allowedWeekdays, day];
    onUpdate({ allowedWeekdays: next });
  };

  return (
    <View
      style={[
        s.card,
        getCardStyle("medium"),
        { backgroundColor: colors.cardBackground, borderColor: colors.cardBorderHighlight },
      ]}
    >
      {/* Order badge + title + trash */}
      <View style={s.headerRow}>
        <View style={[s.orderBadge, { backgroundColor: colors.cardBackgroundLight }]}>
          <Text style={[s.orderText, { color: colors.textSecondary }]}>{index + 1}</Text>
        </View>
        <TextInput
          style={[s.titleInput, { color: colors.textPrimary, borderBottomColor: colors.border }]}
          placeholder="e.g. Morning run, Study session…"
          placeholderTextColor={colors.textTertiary}
          value={step.title}
          onChangeText={(v) => onUpdate({ title: v })}
          returnKeyType="done"
        />
        {showDelete && (
          <TouchableOpacity onPress={onRemove} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="trash-outline" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      {/* TYPE toggle */}
      <View style={s.labelRow}>
        <Text style={[s.chipLabel, { color: colors.textTertiary }]}>TYPE</Text>
        <ToggleSwitch
          value={step.type === "recurring"}
          onValueChange={(v) => onUpdate({ type: v ? "recurring" : "one_time" })}
          activeLabel="Recurring"
          inactiveLabel="One time"
        />
      </View>

      {/* DURATION */}
      <Text style={[s.chipLabel, { color: colors.textTertiary }]}>DURATION</Text>
      <View style={s.durationRow}>
        {DURATION_PRESETS.map((d) => {
          const active = step.estimatedMinutes === d;
          return (
            <TouchableOpacity
              key={d}
              onPress={() => onUpdate({ estimatedMinutes: d })}
              style={[
                s.chip,
                {
                  backgroundColor: active ? `${colors.primary}22` : colors.cardBackgroundLight,
                  borderColor: active ? colors.primary : colors.border,
                },
              ]}
            >
              <Text style={[s.chipText, { color: active ? colors.primary : colors.textSecondary }]}>
                {d}m
              </Text>
            </TouchableOpacity>
          );
        })}
        <View style={{ flex: 1 }} />
        <TextInput
          style={[s.durationInput, { color: colors.textPrimary, borderBottomColor: colors.border }]}
          value={step.estimatedMinutes > 0 ? String(step.estimatedMinutes) : ""}
          onChangeText={(v) => {
            const n = parseInt(v, 10);
            if (!isNaN(n) && n > 0) onUpdate({ estimatedMinutes: n });
            else if (v === "") onUpdate({ estimatedMinutes: 0 });
          }}
          keyboardType="number-pad"
          maxLength={3}
          placeholder="min"
          placeholderTextColor={colors.textTertiary}
        />
      </View>

      {/* FREQUENCY — recurring only */}
      {step.type === "recurring" && (
        <>
          <View style={[s.divider, { backgroundColor: colors.border }]} />

          <View style={s.labelRow}>
            <Text style={[s.chipLabel, { color: colors.textTertiary }]}>FREQUENCY</Text>
            <ToggleSwitch
              value={step.isDaily}
              onValueChange={(v) => onUpdate({ isDaily: v })}
              activeLabel="Daily"
              inactiveLabel="Custom"
            />
          </View>

          <View style={s.weekdayRow}>
            {WEEKDAYS.map((day) => {
              const selected = !step.isDaily && step.allowedWeekdays.includes(day.value);
              return (
                <TouchableOpacity
                  key={day.value}
                  onPress={() => !step.isDaily && toggleWeekday(day.value)}
                  disabled={step.isDaily}
                  style={[
                    s.dayChip,
                    {
                      backgroundColor: selected
                        ? `${colors.primary}22`
                        : colors.cardBackgroundLight,
                      borderColor: selected ? colors.primary : colors.border,
                      opacity: step.isDaily ? 0.35 : 1,
                    },
                  ]}
                >
                  <Text
                    style={[
                      s.dayChipText,
                      { color: selected ? colors.primary : colors.textSecondary },
                    ]}
                  >
                    {day.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}
    </View>
  );
}

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    card: { padding: Spacing.lg, marginBottom: Spacing.md, gap: Spacing.sm },
    headerRow: { flexDirection: "row", alignItems: "center", gap: Spacing.sm },
    orderBadge: {
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    orderText: { fontSize: 12, fontWeight: "700" },
    titleInput: {
      flex: 1,
      fontSize: 16,
      fontWeight: "500",
      paddingVertical: 6,
      borderBottomWidth: 1,
    },
    labelRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: Spacing.md,
      marginTop: Spacing.sm,
    },
    chipLabel: { ...Typography.body3, letterSpacing: 0.8 },
    durationRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 },
    chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
    chipText: { fontSize: 13, fontWeight: "600" },
    durationInput: {
      width: 48,
      fontSize: 16,
      fontWeight: "500",
      paddingVertical: 6,
      borderBottomWidth: 1,
    },
    divider: { height: 1, marginVertical: Spacing.sm },
    weekdayRow: { flexDirection: "row", gap: 6, marginTop: 4 },
    dayChip: {
      width: 36,
      height: 36,
      borderRadius: 18,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    dayChipText: { fontSize: 12, fontWeight: "700" },
  });
