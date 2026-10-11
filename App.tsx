import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, useApp } from './src/context/AppContext';
import LoginScreen from './src/screens/LoginScreen';
import TodoScreen from './src/screens/TodoScreen';
import ExpenseScreen from './src/screens/ExpenseScreen';

const TABS = [
  { key: 'todo', label: 'Todos' },
  { key: 'expense', label: 'Expenses' },
] as const;

function Header() {
  const { user, logout } = useApp();
  return (
    <View style={styles.header}>
      <View style={styles.headerUserInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.username.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.headerUsername}>{user?.username}</Text>
      </View>
      <Pressable style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
    </View>
  );
}

function MainScreen() {
  const { activeTab, setActiveTab } = useApp();
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Header />
      <View style={styles.tabBar}>
        {TABS.map((tab) => (
          <Pressable
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              style={[
                styles.tabLabel,
                activeTab === tab.key && styles.tabLabelActive,
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.content}>
        {activeTab === 'todo' ? <TodoScreen /> : <ExpenseScreen />}
      </View>
    </View>
  );
}

function Root() {
  const { user } = useApp();
  if (!user) {
    return <LoginScreen />;
  }
  return <MainScreen />;
}

export default function App() {
  return (
    <AppProvider>
      <Root />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
    backgroundColor: '#fff',
  },
  headerUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4f6df5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  headerUsername: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2330',
  },
  logoutButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d9dce3',
  },
  logoutText: {
    color: '#d64545',
    fontSize: 13,
    fontWeight: '600',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#f0f1f5',
  },
  tabActive: {
    backgroundColor: '#4f6df5',
  },
  tabLabel: {
    color: '#5a5f6e',
    fontSize: 14,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
});
