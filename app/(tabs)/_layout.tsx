import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router, Tabs } from "expo-router";
import { Button } from "react-native";
import { primaryColor } from "src/constant/color";

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="(expense)"
      screenOptions={{ tabBarActiveTintColor: primaryColor }}
    >
      <Tabs.Screen
        name="(expense)"
        options={{
          headerShown: false,
          title: "Expense",
          tabBarLabel: "Expense",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="money" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(todos)"
        options={{
          headerShown: false,
          title: "Todos",
          tabBarLabel: "Todos",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="list" color={color} />
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
      <Tabs.Screen
        name="(user)"
        options={{
          headerShown: false,
          title: "Login",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="user" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
