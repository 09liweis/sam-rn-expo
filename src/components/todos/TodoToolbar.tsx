import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../theme';

interface TodoToolbarProps {
  remaining: number;
  total: number;
  loading: boolean;
  onRefresh: () => void;
  onAdd: () => void;
}

export function TodoToolbar({
  remaining,
  total,
  loading,
  onRefresh,
  onAdd,
}: TodoToolbarProps) {
  return (
    <View style={styles.toolbar}>
      <View>
        <Text style={styles.toolbarTitle}>My Todos</Text>
        <Text style={styles.toolbarSubtitle}>
          {total === 0 ? 'Nothing here yet' : `${remaining} of ${total} remaining`}
        </Text>
      </View>
      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={onAdd}
          accessibilityRole="button"
        >
          <Text style={styles.addText}>＋ Add Todo</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.refreshButton,
            (loading || pressed) && styles.buttonPressed,
          ]}
          onPress={onRefresh}
          disabled={loading}
          accessibilityLabel="Refresh todos"
          accessibilityRole="button"
        >
          {loading ? (
            <ActivityIndicator size="small" color={theme.primary} />
          ) : (
            <Text style={styles.refreshText}>↻</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  toolbarTitle: {
    color: theme.ink,
    fontSize: theme.font.title,
    fontWeight: '800',
  },
  toolbarSubtitle: {
    color: theme.textFaint,
    fontSize: theme.font.caption,
    marginTop: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addButton: {
    minHeight: 38,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    color: '#fff',
    fontSize: theme.font.caption,
    fontWeight: '700',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  refreshButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: theme.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshText: {
    color: theme.primary,
    fontSize: 18,
    fontWeight: '700',
  },
});
