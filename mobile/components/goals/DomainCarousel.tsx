import React from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import type { LifeDomain } from "@better-you/shared";
import { useTheme } from "@/src/contexts/ThemeContext";
import { Spacing, Typography } from "@/constants/DesignTokens";
import { DOMAIN_ICONS } from "./DomainGrid";
import { DomainIcon } from "./DomainCard";

const CARD_WIDTH = 108;
const CARD_GAP = 10;

const DOMAINS: { domain: LifeDomain; label: string }[] = [
  { domain: "BODY", label: "Body" },
  { domain: "MIND", label: "Mind" },
  { domain: "SOCIAL", label: "Relationships" },
  { domain: "WORK", label: "Work" },
  { domain: "MONEY", label: "Money" },
  { domain: "SERVICE", label: "Service" },
  { domain: "SPIRITUALITY", label: "Spirituality" },
];

interface DomainCarouselProps {
  selectedDomain: LifeDomain | null;
  onSelect: (domain: LifeDomain) => void;
}

export function DomainCarousel({ selectedDomain, onSelect }: DomainCarouselProps) {
  const { colors } = useTheme();

  return (
    <View>
      <Text style={[styles.label, { color: colors.textTertiary, marginLeft: 24 }]}>
        LIFE DOMAIN
      </Text>
      <FlatList
        data={DOMAINS}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + CARD_GAP}
        decelerationRate="fast"
        keyExtractor={(item) => item.domain}
        contentContainerStyle={{ paddingHorizontal: 24 }}
        ItemSeparatorComponent={() => <View style={{ width: CARD_GAP }} />}
        style={{ marginTop: Spacing.sm }}
        renderItem={({ item }) => {
          const selected = selectedDomain === item.domain;
          const iconDef = DOMAIN_ICONS[item.domain];
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onSelect(item.domain)}
              style={[
                styles.card,
                { width: CARD_WIDTH },
                {
                  backgroundColor: selected ? `${colors.primary}18` : colors.cardBackground,
                  borderColor: selected ? colors.primary : colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.iconWrap,
                  {
                    backgroundColor: selected ? `${colors.primary}22` : colors.cardBackgroundLight,
                  },
                ]}
              >
                <DomainIcon
                  iconDef={iconDef}
                  size={28}
                  color={selected ? colors.primary : colors.textTertiary}
                />
              </View>
              <Text
                style={[
                  styles.cardLabel,
                  { color: selected ? colors.textPrimary : colors.textSecondary },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: { ...Typography.body3, letterSpacing: 1 },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cardLabel: { ...Typography.body3, textAlign: "center" },
});
