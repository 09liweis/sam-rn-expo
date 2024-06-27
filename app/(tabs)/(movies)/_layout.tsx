import { Stack } from "expo-router";

export default function TabLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          // Hide the header for all other routes.
          headerShown: false,
        }}
      />
      <Stack.Screen name="movieDetail" options={{}} />
    </Stack>
  );
}
