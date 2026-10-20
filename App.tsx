import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { AppProvider, useApp } from './src/context/AppContext';
import { theme } from './src/theme';
import LoginScreen from './src/screens/LoginScreen';
import TodoScreen from './src/screens/TodoScreen';
import ExpenseScreen from './src/screens/ExpenseScreen';
import {TODO_TAB,EXPENSE_TAB} from './src/types';

const TABS = [
  { key: TODO_TAB, label: 'Todos' },
  { key: EXPENSE_TAB, label: 'Expenses' },
] as const;

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function Header() {
  const { user, logout } = useApp();
  const name = user?.email.split('@')[0] ?? '';
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <LinearGradient
          colors={[theme.primary, theme.violet]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatar}
        >
          <Text style={styles.avatarText}>
            {(name || 'U').charAt(0).toUpperCase()}
          </Text>
        </LinearGradient>
        <View>
          <Text style={styles.greeting}>{greeting()}</Text>
          <Text style={styles.userName} numberOfLines={1}>
            {name || user?.email}
          </Text>
        </View>
      </View>
      <Pressable
        style={({ pressed }) => [
          styles.logoutButton,
          pressed && styles.logoutPressed,
        ]}
        onPress={logout}
      >
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
    </View>
  );
}

function TabBar() {
  const { activeTab, setActiveTab } = useApp();
  return (
    <View style={styles.tabBar}>
      {TABS.map((tab) => {
        const active = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            style={[styles.tab, active && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function MainScreen() {
  const { activeTab } = useApp();
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Header />
      <View style={styles.tabBarWrap}>
        <TabBar />
      </View>
      <View style={styles.content}>
        {activeTab === 'todo' ? <TodoScreen /> : <ExpenseScreen />}
      </View>
    </View>
  );
}

function Root() {
  const { initializing, user } = useApp();
  if (initializing) {
    return (
      <View style={styles.splash}>
        <LinearGradient
          colors={[theme.primary, theme.violet]}
          style={styles.splashBadge}
        >
          <Text style={styles.splashBadgeText}>S</Text>
        </LinearGradient>
      </View>
    );
  }
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
    backgroundColor: theme.bg,
  },
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.bg,
  },
  splashBadge: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashBadgeText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 14,
    backgroundColor: theme.surface,
    borderBottomLeftRadius: theme.radius.lg,
    borderBottomRightRadius: theme.radius.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  greeting: {
    color: theme.textFaint,
    fontSize: theme.font.micro,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  userName: {
    color: theme.ink,
    fontSize: theme.font.title,
    fontWeight: '800',
    marginTop: 1,
  },
  logoutButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.redSoft,
  },
  logoutPressed: {
    opacity: 0.75,
  },
  logoutText: {
    color: theme.red,
    fontSize: theme.font.caption,
    fontWeight: '700',
  },
  tabBarWrap: {
    paddingHorizontal: 20,
    paddingTop: 14,
    backgroundColor: theme.bg,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: theme.surface,
    borderRadius: theme.radius.md,
    padding: 4,
    gap: 4,
    borderWidth: 1,
    borderColor: theme.borderSoft,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: theme.primary,
  },
  tabLabel: {
    color: theme.textSoft,
    fontSize: theme.font.caption,
    fontWeight: '700',
  },
  tabLabelActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
});
