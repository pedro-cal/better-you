import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/src/contexts/ThemeContext";

interface QuoteCardProps {
  quote: string;
  author: string;
}

export function QuoteCard({ quote, author }: QuoteCardProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.border, { backgroundColor: colors.primary }]} />
      <View style={styles.content}>
        <Text style={[styles.quote, { color: colors.textPrimary }]}>"{quote}"</Text>
        <Text style={[styles.author, { color: colors.textSecondary }]}>— {author}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 24,
    marginBottom: 32,
  },
  border: {
    width: 3,
    borderRadius: 2,
    marginRight: 16,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  quote: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
    fontStyle: "italic",
  },
  author: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
