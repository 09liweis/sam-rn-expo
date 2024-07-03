import { Stack } from "expo-router";
export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          // Hide the header for all other routes.
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="roomForm"
        options={{
          // Hide the header for all other routes.
          // headerShown: false,
          title: "Add a new room",
        }}
      />
      <Stack.Screen
        name="renteeForm"
        options={{
          // Hide the header for all other routes.
          // headerShown: false,
          title: "Add a new rentee",
        }}
      />
      {/* <Stack.Screen
        name="modal"
        options={{
          // Set the presentation mode to modal for our modal route.
          presentation: "modal",
        }}
      /> */}
    </Stack>
  );
}
