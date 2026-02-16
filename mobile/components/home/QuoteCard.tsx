import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

interface QuoteCardProps {
  quote: string;
  author: string;
}

export function QuoteCard({ quote, author }: QuoteCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.border} />
      <View style={styles.content}>
        <Text style={styles.quote}>"{quote}"</Text>
        <Text style={styles.author}>— {author}</Text>
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
    backgroundColor: Colors.primary,
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
    color: Colors.textPrimary,
    marginBottom: 8,
    fontStyle: "italic",
  },
  author: {
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
