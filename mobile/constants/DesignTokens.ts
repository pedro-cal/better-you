// Better You Design System - Central Configuration
// ⚙️ ADJUST ALL VISUAL TOKENS HERE
//
// 🔄 IMPORTANT: After changing values here, you MUST reload the app:
//    - Press 'r' in Metro bundler terminal
//    - OR shake device → "Reload"
//    - OR Ctrl+M (Android) / Cmd+D (iOS) → "Reload"

import { ViewStyle } from "react-native";

// ═══════════════════════════════════════════════════════════════
// 🎨 CARD SHADOWS & ELEVATION
// ═══════════════════════════════════════════════════════════════

export const CardShadow = {
  // Main card shadow (NextStepCard, WeeklyLoadCard, DomainCard)
  large: {
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  } as ViewStyle,

  // Small card shadow (StepCard in lists)
  medium: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  } as ViewStyle,

  // Subtle shadow for nested elements
  small: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  } as ViewStyle,
};

// ═══════════════════════════════════════════════════════════════
// 🔲 CARD BORDERS & GLASS EFFECT
// ═══════════════════════════════════════════════════════════════

export const CardBorder = {
  // Glass border width for neumorphic effect
  width: 1,

  // Border radius values
  radius: {
    large: 16, // Main cards
    medium: 12, // Step cards
    small: 8, // Buttons, chips
  },
};

// ═══════════════════════════════════════════════════════════════
// 📐 SPACING SYSTEM
// ═══════════════════════════════════════════════════════════════

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// ═══════════════════════════════════════════════════════════════
// 🃏 COMPLETE CARD STYLE PRESETS
// ═══════════════════════════════════════════════════════════════

export const getCardStyle = (size: "large" | "medium" | "small" = "large"): ViewStyle => {
  const shadowConfig =
    size === "large" ? CardShadow.large : size === "medium" ? CardShadow.medium : CardShadow.small;
  const borderRadius =
    size === "large"
      ? CardBorder.radius.large
      : size === "medium"
        ? CardBorder.radius.medium
        : CardBorder.radius.small;

  return {
    borderRadius,
    borderWidth: CardBorder.width,
    ...shadowConfig,
  };
};
