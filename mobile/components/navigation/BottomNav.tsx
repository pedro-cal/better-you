import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

type NavItem = "metrics" | "goals" | "act" | "social" | "competition";

interface BottomNavProps {
  activeItem?: NavItem;
  onItemPress?: (item: NavItem) => void;
}

export function BottomNav({ activeItem = "act", onItemPress }: BottomNavProps) {
  const iconColor = "#FFFFFF"; // All icons white as requested

  const renderIcon = (item: NavItem) => {
    const isActive = activeItem === item;

    switch (item) {
      case "metrics":
        return (
          <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
            <Ionicons name="stats-chart" size={24} color={iconColor} />
          </View>
        );
      case "goals":
        return (
          <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
            <Ionicons name="calendar-outline" size={24} color={iconColor} />
          </View>
        );
      case "act":
        return (
          <View
            style={[
              styles.quickAddButton,
              isActive ? styles.quickAddButtonActive : styles.quickAddButtonInactive,
            ]}
          >
            <Ionicons
              name="radio-button-on"
              size={32}
              color={isActive ? Colors.background : iconColor}
            />
          </View>
        );
      case "social":
        return (
          <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
            <Ionicons name="people" size={24} color={iconColor} />
          </View>
        );
      case "competition":
        return (
          <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
            <Ionicons name="trophy" size={24} color={iconColor} />
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <TouchableOpacity style={styles.navItem} onPress={() => onItemPress?.("metrics")}>
        {renderIcon("metrics")}
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => onItemPress?.("goals")}>
        {renderIcon("goals")}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navItem, styles.actItem]}
        onPress={() => onItemPress?.("act")}
      >
        {renderIcon("act")}
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => onItemPress?.("social")}>
        {renderIcon("social")}
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => onItemPress?.("competition")}>
        {renderIcon("competition")}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  actItem: {
    marginTop: -20,
  },
  iconContainer: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 2,
    borderTopColor: "transparent",
  },
  iconContainerActive: {
    borderTopColor: Colors.primary,
  },
  quickAddButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  quickAddButtonActive: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  quickAddButtonInactive: {
    backgroundColor: Colors.cardBackgroundLight,
    shadowOpacity: 0,
    elevation: 0,
  },
});
