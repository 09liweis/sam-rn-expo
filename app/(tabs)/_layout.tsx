import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router, Tabs } from "expo-router";
import { Button } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="(room)"
      screenOptions={{ tabBarActiveTintColor: "red" }}
    >
      <Tabs.Screen
        name="(room)"
        options={{
          // headerRight: () => (
          //   <Button
          //     onPress={() => router.push("(room)/form")}
          //     title="Add Room"
          //   />
          // ),
          headerShown: false,
          title: "Rooms",
          tabBarLabel: "Rooms",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(movies)"
        options={{
          headerShown: false,
          title: "Movies",
          tabBarLabel: "Movies",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="film" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          headerShown: false,
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="cog" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
