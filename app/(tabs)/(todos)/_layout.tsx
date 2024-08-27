import { Stack } from "expo-router";

export default function TabLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="TodoList"
        options={{
          // Hide the header for all other routes.
          headerShown: false,
        }}
      />
    </Stack>
  );
}
