import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import useUserStore from "src/stores/userStore";
import { router } from "expo-router";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

export default function ProfilePage() {
  const { user, logout } = useUserStore();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  if (!user) {
    router.replace("/login");
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={80} color="#666" />
        </View>
        <Text style={styles.name}>{user.name || "User"}</Text>
        <Text style={styles.email}>{user.eml}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        
        <Pressable style={styles.menuItem}>
          <MaterialIcons name="person-outline" size={24} color="#666" />
          <Text style={styles.menuText}>Edit Profile</Text>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </Pressable>

        <Pressable style={styles.menuItem}>
          <MaterialIcons name="notifications-none" size={24} color="#666" />
          <Text style={styles.menuText}>Notifications</Text>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </Pressable>

        <Pressable style={styles.menuItem}>
          <MaterialIcons name="security" size={24} color="#666" />
          <Text style={styles.menuText}>Privacy & Security</Text>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Settings</Text>

        <Pressable style={styles.menuItem}>
          <MaterialIcons name="language" size={24} color="#666" />
          <Text style={styles.menuText}>Language</Text>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </Pressable>

        <Pressable style={styles.menuItem}>
          <MaterialIcons name="help-outline" size={24} color="#666" />
          <Text style={styles.menuText}>Help & Support</Text>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </Pressable>
      </View>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <MaterialIcons name="logout" size={24} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: "#666",
  },
  section: {
    backgroundColor: "#fff",
    marginTop: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: "#1a1a1a",
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e32f45",
    marginHorizontal: 16,
    marginVertical: 24,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
