import React from "react";
import { View, Switch, Text, StyleSheet } from "react-native";
import { useTheme } from "@/src/contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme, colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{theme === "dark" ? "🌙" : "☀️"}</Text>
      <Switch
        value={theme === "dark"}
        onValueChange={toggleTheme}
        trackColor={{ false: "rgba(255,255,255,0.3)", true: "rgba(255,255,255,0.3)" }}
        thumbColor={colors.textPrimary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.05)",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 20,
  },
  icon: {
    fontSize: 16,
  },
});
