import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

type NavItem = "planning" | "metrics" | "act" | "social" | "competition";

interface BottomNavProps {
  activeItem?: NavItem;
  onItemPress?: (item: NavItem) => void;
}

export function BottomNav({ activeItem = "act", onItemPress }: BottomNavProps) {
  const iconColor = "#FFFFFF"; // All icons white as requested

  const renderIcon = (item: NavItem) => {
    const isActive = activeItem === item;

    switch (item) {
      case "planning":
        return (
          <View style={styles.iconContainer}>
            <Ionicons name="clipboard-outline" size={24} color={iconColor} />
          </View>
        );
      case "metrics":
        return (
          <View style={styles.iconContainer}>
            <Ionicons name="stats-chart" size={24} color={iconColor} />
          </View>
        );
      case "act":
        return (
          <View style={[styles.quickAddButton, isActive && styles.quickAddButtonActive]}>
            <Ionicons name="radio-button-on" size={32} color={Colors.background} />
          </View>
        );
      case "social":
        return (
          <View style={styles.iconContainer}>
            <Ionicons name="people" size={24} color={iconColor} />
          </View>
        );
      case "competition":
        return (
          <View style={styles.iconContainer}>
            <Ionicons name="trophy" size={24} color={iconColor} />
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.navItem} onPress={() => onItemPress?.("planning")}>
        {renderIcon("planning")}
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => onItemPress?.("metrics")}>
        {renderIcon("metrics")}
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
    </View>
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
    paddingBottom: 24,
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
  },
  quickAddButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  quickAddButtonActive: {
    backgroundColor: Colors.primaryDark,
  },
});
