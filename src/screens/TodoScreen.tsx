import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { Todo } from '../types';

function formatDate(date: string): string {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function TodoScreen() {
  const { todos, todosLoading, todosError, fetchTodos, user } = useApp();

  useEffect(() => {
    if (user) {
      void fetchTodos();
    }
  }, [user, fetchTodos]);

  const renderItem = ({ item }: { item: Todo }) => (
    <View style={styles.row}>
      <View style={styles.rowInfo}>
        <Text style={styles.rowTitle}>{item.name}</Text>
        <Text style={styles.rowDate}>{formatDate(item.date)}</Text>
      </View>
      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Text style={styles.toolbarTitle}>
          {todosLoading ? 'Loading…' : `${todos.length} todo${todos.length === 1 ? '' : 's'}`}
        </Text>
        <Pressable
          style={[styles.refreshButton, todosLoading && styles.refreshDisabled]}
          onPress={() => void fetchTodos()}
          disabled={todosLoading}
        >
          {todosLoading ? (
            <ActivityIndicator size="small" color="#4f6df5" />
          ) : (
            <Text style={styles.refreshText}>Refresh</Text>
          )}
        </Pressable>
      </View>

      {todosError ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{todosError}</Text>
          <Pressable style={styles.retryButton} onPress={() => void fetchTodos()}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : null}

      <FlatList
        data={todos}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={todos.length === 0 && !todosLoading && !todosError && styles.empty}
        ListEmptyComponent={
          !todosLoading && !todosError ? (
            <Text style={styles.emptyText}>No todos found</Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f6fa',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  toolbarTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5a5f6e',
  },
  refreshButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4f6df5',
  },
  refreshDisabled: {
    opacity: 0.6,
  },
  refreshText: {
    color: '#4f6df5',
    fontSize: 13,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
  },
  rowInfo: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    color: '#1f2330',
    fontWeight: '500',
  },
  rowDate: {
    fontSize: 12,
    color: '#a5aab5',
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: '#e8ecfd',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusText: {
    color: '#4f6df5',
    fontSize: 12,
    fontWeight: '600',
  },
  errorBox: {
    backgroundColor: '#fdeaea',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
  },
  errorText: {
    color: '#d64545',
    fontSize: 13,
    marginBottom: 8,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#d64545',
  },
  retryText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  empty: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#a5aab5',
    fontSize: 14,
  },
});
