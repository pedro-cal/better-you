import React, { useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Animated, StyleSheet } from "react-native";
import { useTheme } from "@/src/contexts/ThemeContext";

interface ToggleSwitchProps {
  value: boolean;
  onValueChange: (v: boolean) => void;
  activeLabel: string;
  inactiveLabel: string;
}

export function ToggleSwitch({
  value,
  onValueChange,
  activeLabel,
  inactiveLabel,
}: ToggleSwitchProps) {
  const { colors } = useTheme();
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [value, anim]);

  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [2, 18] });
  const trackColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.textPrimary],
  });

  return (
    <TouchableOpacity onPress={() => onValueChange(!value)} activeOpacity={0.8} style={styles.row}>
      <Animated.View style={[styles.track, { backgroundColor: trackColor }]}>
        <Animated.View
          style={[
            styles.thumb,
            { backgroundColor: colors.cardBackground, transform: [{ translateX }] },
          ]}
        />
      </Animated.View>
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        {value ? activeLabel : inactiveLabel}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  track: { width: 40, height: 24, borderRadius: 12, justifyContent: "center" },
  thumb: { width: 20, height: 20, borderRadius: 10 },
  label: { fontSize: 13, fontWeight: "600" },
});
