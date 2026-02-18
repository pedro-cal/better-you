// Better You Design System Colors - Theme Support

export interface ColorScheme {
  // Primary
  primary: string;
  primaryDark: string;

  // Backgrounds
  background: string;
  cardBackground: string;
  cardBackgroundLight: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;

  // Status
  success: string;
  partial: string;
  skip: string;

  // Borders
  border: string;
  borderLight: string;

  // Progress
  progressBackground: string;
  progressFill: string;

  // Shadows & Neumorphism
  shadowColor: string;
  cardBorderHighlight: string;
}

export const DarkTheme: ColorScheme = {
  // Primary - Muted sage accent
  primary: "#7FBF7F",
  primaryDark: "#6FAF6F",

  // Backgrounds - Blue-night forest palette
  // Note: Background gradient spec: #0E1A2B (top) → #16263C (mid) → #1E2F46 (bottom)
  background: "#16263C",
  cardBackground: "#1F2E44",
  cardBackgroundLight: "#263850",

  // Text - Soft blue-tinted whites
  textPrimary: "#E6EEF6",
  textSecondary: "#A9B8C8",
  textTertiary: "#7C8FA3",

  // Status - Organic sage tones
  success: "#7FBF7F",
  partial: "#E6EEF6",
  skip: "#E6EEF6",

  // Borders - Cool blue-gray tones
  border: "#2A3B52",
  borderLight: "#263850",

  // Progress - Muted sage with cool background
  progressBackground: "#2A3B52",
  progressFill: "#7FBF7F",

  // Shadows & Neumorphism - Soft, diffuse shadows with glass highlight
  shadowColor: "rgba(10, 20, 35, 0.5)",
  cardBorderHighlight: "rgba(230, 238, 246, 0.08)",
};

export const LightTheme: ColorScheme = {
  // Primary
  primary: "#88B76A",
  primaryDark: "#73A355",

  // Backgrounds
  background: "#F5F5F0",
  cardBackground: "#FFFFFF",
  cardBackgroundLight: "#F9F9F7",

  // Text
  textPrimary: "#2D3E45",
  textSecondary: "#6B7E87",
  textTertiary: "#8B9CA5",

  // Status
  success: "#88B76A",
  partial: "#2D3E45",
  skip: "#2D3E45",

  // Borders
  border: "#E5E5E0",
  borderLight: "#D0D0CA",

  // Progress
  progressBackground: "rgba(136, 183, 106, 0.15)",
  progressFill: "#88B76A",

  // Shadows & Neumorphism - Ultra-soft, diffuse shadows with glass highlight
  shadowColor: "rgba(45, 62, 69, 0.08)",
  cardBorderHighlight: "rgba(255, 255, 255, 0.85)",
};

// Default export for current theme (will be replaced by context)
export let Colors: ColorScheme = DarkTheme;

export const setTheme = (theme: "light" | "dark") => {
  Colors = theme === "light" ? LightTheme : DarkTheme;
};

// Legacy support for themed components
export default {
  light: {
    text: LightTheme.textPrimary,
    background: LightTheme.background,
    tint: LightTheme.primary,
    tabIconDefault: LightTheme.textSecondary,
    tabIconSelected: LightTheme.primary,
  },
  dark: {
    text: DarkTheme.textPrimary,
    background: DarkTheme.background,
    tint: DarkTheme.primary,
    tabIconDefault: DarkTheme.textSecondary,
    tabIconSelected: DarkTheme.primary,
  },
};
