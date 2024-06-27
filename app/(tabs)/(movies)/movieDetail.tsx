import { router, Stack, useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function MovieDetail() {
  const { title, douban_id } = useLocalSearchParams();
  console.log(title);
  return (
    <View>
      <Stack.Screen
        options={{
          title: title?.toString(),
        }}
      />
      <Text>{title}</Text>
    </View>
  );
}
