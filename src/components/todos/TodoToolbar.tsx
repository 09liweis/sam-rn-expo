import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../theme';

interface TodoToolbarProps {
  remaining: number;
  total: number;
  loading: boolean;
  onRefresh: () => void;
}

export function TodoToolbar({
  remaining,
  total,
  loading,
  onRefresh,
}: TodoToolbarProps) {
  return (
    <View style={styles.toolbar}>
      <View>
        <Text style={styles.toolbarTitle}>My Todos</Text>
        <Text style={styles.toolbarSubtitle}>
          {total === 0 ? 'Nothing here yet' : `${remaining} of ${total} remaining`}
        </Text>
      </View>
      <Pressable
        style={({ pressed }) => [
          styles.refreshButton,
          (loading || pressed) && styles.refreshPressed,
        ]}
        onPress={onRefresh}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color={theme.primary} />
        ) : (
          <Text style={styles.refreshText}>↻</Text>
        )}
      </Pressable>
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
  refreshButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: theme.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshPressed: {
    opacity: 0.7,
  },
  refreshText: {
    color: theme.primary,
    fontSize: 18,
    fontWeight: '700',
  },
});
