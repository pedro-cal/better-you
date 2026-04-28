import React from "react";
import { View, Image, Text, StyleSheet, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/src/contexts/ThemeContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Typography } from "@/constants/DesignTokens";

const landscapeDay = require("@/assets/images/landscapes/landscape-beach-day.png");
const landscapeNight = require("@/assets/images/landscapes/landscape-beach-night.png");

interface LandscapeHeaderProps {
  quote?: string;
  quoteAuthor?: string;
}

export function LandscapeHeader({ quote, quoteAuthor }: LandscapeHeaderProps) {
  const { colors, theme } = useTheme();
  const { height } = useWindowDimensions();

  return (
    <View style={[styles.container, { height: height * (quote ? 0.28 : 0.2) }]}>
      <Image
        source={theme === "dark" ? landscapeNight : landscapeDay}
        style={styles.image}
        resizeMode="cover"
      />
      <LinearGradient colors={["transparent", colors.background]} style={styles.gradient} />
      {quote && (
        <View style={styles.quoteWrapper}>
          <Text style={[styles.quoteText, { color: colors.textPrimary }]}>"{quote}"</Text>
          {quoteAuthor && (
            <Text style={[styles.quoteAuthor, { color: colors.textSecondary }]}>
              — {quoteAuthor}
            </Text>
          )}
        </View>
      )}
      <View style={styles.toggleWrapper}>
        <ThemeToggle />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "70%",
  },
  quoteWrapper: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 60,
  },
  quoteText: {
    ...Typography.body2,
    fontStyle: "italic",
    lineHeight: 19,
  },
  quoteAuthor: {
    ...Typography.body3,
    letterSpacing: 0.5,
    marginTop: 4,
    textTransform: "uppercase",
  },
  toggleWrapper: {
    position: "absolute",
    bottom: -12,
    right: 16,
  },
});
