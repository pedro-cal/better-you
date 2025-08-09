import { useHabits } from "@/src/features/habits/useHabits";
import { View, Text } from "react-native";

export default function HabitsScreen() {
  const { data } = useHabits();
  return (
    <View style={{ padding: 16 }}>
      {data?.map((h) => (
        <Text key={h.id}>
          {h.title} {h.doneToday ? "✅" : "⬜"}
        </Text>
      ))}
    </View>
  );
}
