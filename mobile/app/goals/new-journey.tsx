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
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/contexts/ThemeContext";
import { Typography, Spacing, getCardStyle } from "@/constants/DesignTokens";
import type { LifeDomain } from "@better-you/shared";
import { DomainCarousel } from "@/components/goals/DomainCarousel";
import { apiFetch } from "@/src/lib/apiClient";
import { queryClient } from "@/src/state/query";
import type { ColorScheme } from "@/constants/Colors";

export default function NewJourneyScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [selectedDomain, setSelectedDomain] = useState<LifeDomain | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = selectedDomain !== null && title.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit || !selectedDomain) return;
    setError(null);
    setIsSubmitting(true);
    try {
      await apiFetch("/api/journeys", {
        method: "POST",
        body: JSON.stringify({
          domain: selectedDomain,
          title: title.trim(),
          description: description.trim() || undefined,
        }),
      });
      await queryClient.invalidateQueries({ queryKey: ["journeys"] });
      router.replace("/(tabs)/goals");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
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
        <Text style={s.headerTitle}>New Journey</Text>
        <View style={{ width: 24 }} />
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
          <Text style={[s.fieldLabel, { color: colors.textTertiary }]}>NAME THIS JOURNEY</Text>
          <TextInput
            style={[
              s.input,
              {
                backgroundColor: colors.cardBackgroundLight,
                borderColor: colors.border,
                color: colors.textPrimary,
              },
            ]}
            placeholder="e.g. Become a runner, Financial independence…"
            placeholderTextColor={colors.textTertiary}
            value={title}
            onChangeText={setTitle}
            returnKeyType="next"
          />

          <View style={[s.divider, { backgroundColor: colors.border }]} />

          <Text style={[s.fieldLabel, { color: colors.textTertiary }]}>
            WHY DOES THIS JOURNEY MATTER?
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
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
          <Text style={[s.fieldCaption, { color: colors.textTertiary }]}>
            Goals you create next can be linked to this journey.
          </Text>
        </View>

        {error && <Text style={[s.errorText, { color: "#E57373" }]}>{error}</Text>}

        <View style={{ height: insets.bottom + 100 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[s.ctaContainer, { paddingBottom: insets.bottom + Spacing.lg }]}>
        <TouchableOpacity
          style={[
            s.ctaButton,
            {
              backgroundColor: canSubmit ? colors.primary : colors.cardBackgroundLight,
              opacity: isSubmitting ? 0.6 : 1,
            },
          ]}
          onPress={handleSubmit}
          disabled={!canSubmit || isSubmitting}
          activeOpacity={0.85}
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text
              style={[s.ctaText, { color: canSubmit ? colors.background : colors.textTertiary }]}
            >
              Create Journey
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
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: Spacing.xxl,
      paddingVertical: Spacing.lg,
    },
    headerTitle: { ...Typography.title3, color: colors.textPrimary },
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
    errorText: { fontSize: 13, marginHorizontal: Spacing.xxl, marginTop: Spacing.md },
    ctaContainer: {
      paddingHorizontal: Spacing.xxl,
      paddingTop: Spacing.md,
      backgroundColor: colors.background,
    },
    ctaButton: { borderRadius: 14, paddingVertical: 18, alignItems: "center" },
    ctaText: { ...Typography.body1, fontSize: 16 },
  });
