import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@/src/contexts/ThemeContext";
import { Typography } from "@/constants/DesignTokens";

interface Tab {
  id: string;
  label: string;
}

interface TabSelectorProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function TabSelector({ tabs, activeTab, onTabChange }: TabSelectorProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <TouchableOpacity key={tab.id} style={styles.tab} onPress={() => onTabChange(tab.id)}>
            <Text
              style={[
                styles.tabText,
                { color: isActive ? colors.textPrimary : colors.textSecondary },
              ]}
            >
              {tab.label}
            </Text>
            {isActive && (
              <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 32,
  },
  tab: {
    paddingBottom: 12,
  },
  tabText: {
    ...Typography.body1,
    letterSpacing: 0.5,
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
  },
});
