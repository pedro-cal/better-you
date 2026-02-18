import React from "react";
import { View, Switch, Text, StyleSheet } from "react-native";
import { useTheme } from "@/src/contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme, colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.cardBackground }]}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
      </Text>
      <Switch
        value={theme === "dark"}
        onValueChange={toggleTheme}
        trackColor={{ false: colors.textSecondary, true: colors.primary }}
        thumbColor={colors.textPrimary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
});
