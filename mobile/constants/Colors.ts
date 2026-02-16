// Better You Design System Colors
export const Colors = {
  // Primary
  primary: "#39FF14",
  primaryDark: "#2FCC10",

  // Backgrounds
  background: "#253639",
  cardBackground: "#2F4245",
  cardBackgroundLight: "#1A2B2E",

  // Text
  textPrimary: "#FFFFFF",
  textSecondary: "#8FA1A4",
  textTertiary: "#5A6E72",

  // Status
  success: "#39FF14",
  partial: "#FFFFFF",
  skip: "#FFFFFF",

  // Borders
  border: "#1A2B2E",
  borderLight: "#3A4D50",

  // Progress
  progressBackground: "#1A2B2E",
  progressFill: "#39FF14",
} as const;

// Legacy support for themed components
const tintColorLight = "#2f95dc";
const tintColorDark = Colors.primary;

export default {
  light: {
    text: "#000",
    background: "#fff",
    tint: tintColorLight,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: Colors.textPrimary,
    background: Colors.background,
    tint: tintColorDark,
    tabIconDefault: Colors.textSecondary,
    tabIconSelected: tintColorDark,
  },
};
