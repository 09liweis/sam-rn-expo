import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';
import { useApp } from '../context/AppContext';

export default function LoginScreen() {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please enter your email');
      return;
    }
    if (password.trim().length === 0) {
      setError('Please enter password');
      return;      
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(trimmedEmail, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" />
      <LinearGradient
        colors={[theme.primaryDark, theme.primary, theme.violet]}
        style={styles.hero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.logo}>
          <Text style={styles.logoText}>S</Text>
        </View>
        <Text style={styles.heroTitle}>Sam Life</Text>
        <Text style={styles.heroSubtitle}>Todos & expenses, all in one place</Text>
      </LinearGradient>

      <View style={[styles.card, styles.cardShadow]}>
        <Text style={styles.cardTitle}>Welcome back</Text>
        <Text style={styles.cardSubtitle}>Sign in to continue</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          placeholderTextColor={theme.textFaint}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          textContentType="emailAddress"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Your password"
          placeholderTextColor={theme.textFaint}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textContentType="password"
        />

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <Pressable
          style={({ pressed }) => [
            styles.button,
            (loading || pressed) && styles.buttonPressed,
          ]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  hero: {
    paddingTop: 92,
    paddingBottom: 64,
    alignItems: 'center',
    borderBottomLeftRadius: theme.radius.xl * 1.4,
    borderBottomRightRadius: theme.radius.xl * 1.4,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.55)',
  },
  logoText: {
    color: '#fff',
    fontSize: 50,
    fontWeight: '500',
  },
  heroTitle: {
    color: '#fff',
    fontSize: theme.font.hero,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: theme.font.caption,
    marginTop: 4,
  },
  card: {
    marginTop: -48,
    marginHorizontal: 20,
    backgroundColor: theme.surface,
    borderRadius: theme.radius.xl,
    padding: 24,
  },
  cardShadow: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.1,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  cardTitle: {
    color: theme.ink,
    fontSize: theme.font.title,
    fontWeight: '800',
    textAlign: 'center',
  },
  cardSubtitle: {
    color: theme.textFaint,
    fontSize: theme.font.caption,
    textAlign: 'center',
    marginBottom: 22,
    marginTop: 4,
  },
  label: {
    color: theme.textSoft,
    fontSize: theme.font.micro,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: theme.radius.md,
    padding: 12,
    fontSize: theme.font.body,
    marginBottom: 14,
    color: theme.ink,
    backgroundColor: theme.bg,
  },
  errorBox: {
    backgroundColor: theme.redSoft,
    borderRadius: theme.radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  errorText: {
    color: theme.red,
    fontSize: theme.font.caption,
    textAlign: 'center',
  },
  button: {
    backgroundColor: theme.primary,
    borderRadius: theme.radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
});
