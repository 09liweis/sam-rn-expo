import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { Todo } from '../types';

const DONE_VALUES = ['done', 'completed', 'true', 'finished'];

function isDone(status: string): boolean {
  return DONE_VALUES.includes(status.toLowerCase());
}

function nextStatus(status: string): string {
  return isDone(status) ? 'pending' : 'done';
}

function formatDate(date: string): string {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

export default function TodoScreen() {
  const {
    todos,
    todosLoading,
    todosError,
    fetchTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    user,
  } = useApp();

  const [newTitle, setNewTitle] = useState('');
  const [adding, setAdding] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    if (user) {
      void fetchTodos();
    }
  }, [user, fetchTodos]);

  const runAction = async (id: string | null, action: () => Promise<void>) => {
    setActionError(null);
    setBusyId(id);
    try {
      await action();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setBusyId(null);
    }
  };

  const handleAdd = async () => {
    const name = newTitle.trim();
    if (!name || adding) return;
    setAdding(true);
    setActionError(null);
    try {
      await addTodo(name);
      setNewTitle('');
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to add todo');
    } finally {
      setAdding(false);
    }
  };

  const handleToggle = (todo: Todo) => {
    void runAction(todo._id, () =>
      updateTodo(todo._id, { status: nextStatus(todo.status) }),
    );
  };

  const handleDelete = (todo: Todo) => {
    void runAction(todo._id, () => deleteTodo(todo._id));
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo._id);
    setEditText(todo.name);
    setActionError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const name = editText.trim();
    if (!name) {
      cancelEdit();
      return;
    }
    const id = editingId;
    await runAction(id, async () => {
      await updateTodo(id, { name });
      setEditingId(null);
      setEditText('');
    });
  };

  const renderItem = ({ item }: { item: Todo }) => {
    const done = isDone(item.status);
    const busy = busyId === item._id;
    const editing = editingId === item._id;

    return (
      <View style={styles.row}>
        {busy ? (
          <ActivityIndicator size="small" color="#4f6df5" style={styles.spinner} />
        ) : (
          <Pressable
            style={[styles.checkbox, done && styles.checkboxDone]}
            onPress={() => handleToggle(item)}
            disabled={editing}
            accessibilityLabel={done ? 'Mark as pending' : 'Mark as done'}
          >
            {done ? <Text style={styles.checkmark}>✓</Text> : null}
          </Pressable>
        )}

        {editing ? (
          <View style={styles.editRow}>
            <TextInput
              style={styles.editInput}
              value={editText}
              onChangeText={setEditText}
              autoFocus
              onSubmitEditing={() => void saveEdit()}
              returnKeyType="done"
            />
            <Pressable
              style={[styles.miniButton, styles.saveButton]}
              onPress={() => void saveEdit()}
            >
              <Text style={styles.saveText}>Save</Text>
            </Pressable>
            <Pressable
              style={[styles.miniButton, styles.cancelButton]}
              onPress={cancelEdit}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.rowBody}>
              <Text style={[styles.rowTitle, done && styles.rowTitleDone]}>
                {item.name}
              </Text>
              <Text style={styles.rowDate}>{formatDate(item.date)}</Text>
            </View>
            <Pressable
              style={styles.iconButton}
              onPress={() => startEdit(item)}
              disabled={busy}
              accessibilityLabel="Edit todo"
            >
              <Text style={styles.iconText}>✎</Text>
            </Pressable>
            <Pressable
              style={styles.iconButton}
              onPress={() => handleDelete(item)}
              disabled={busy}
              accessibilityLabel="Delete todo"
            >
              <Text style={styles.deleteText}>✕</Text>
            </Pressable>
          </>
        )}
      </View>
    );
  };

  const remaining = todos.filter((t) => !isDone(t.status)).length;

  return (
    <View style={styles.container}>
      <View style={styles.inputCard}>
        <TextInput
          style={styles.input}
          placeholder="New todo…"
          value={newTitle}
          onChangeText={setNewTitle}
          onSubmitEditing={() => void handleAdd()}
          returnKeyType="done"
        />
        <Pressable
          style={[styles.addButton, adding && styles.addButtonDisabled]}
          onPress={() => void handleAdd()}
          disabled={adding}
        >
          {adding ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.addButtonText}>Add</Text>
          )}
        </Pressable>
      </View>

      {actionError ? (
        <View style={styles.actionErrorBox}>
          <Text style={styles.actionErrorText}>{actionError}</Text>
          <Pressable onPress={() => setActionError(null)}>
            <Text style={styles.dismissText}>✕</Text>
          </Pressable>
        </View>
      ) : null}

      <View style={styles.toolbar}>
        <Text style={styles.toolbarTitle}>
          {todosLoading
            ? 'Loading…'
            : `${todos.length} todo${todos.length === 1 ? '' : 's'} · ${remaining} remaining`}
        </Text>
        <Pressable
          style={[styles.refreshButton, todosLoading && styles.refreshDisabled]}
          onPress={() => void fetchTodos()}
          disabled={todosLoading}
        >
          {todosLoading ? (
            <ActivityIndicator size="small" color="#4f6df5" />
          ) : (
            <Text style={styles.refreshText}>↻ Refresh</Text>
          )}
        </Pressable>
      </View>

      {todosError ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{todosError}</Text>
          <Pressable
            style={styles.retryButton}
            onPress={() => void fetchTodos()}
          >
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : null}

      <FlatList
        data={todos}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={
          todos.length === 0 && !todosLoading && !todosError && styles.empty
        }
        ListEmptyComponent={
          !todosLoading && !todosError ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyEmoji}>📝</Text>
              <Text style={styles.emptyText}>No todos yet</Text>
              <Text style={styles.emptyHint}>Add one above to get started</Text>
            </View>
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
  inputCard: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d9dce3',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: '#fff',
    color: '#1f2330',
  },
  addButton: {
    backgroundColor: '#4f6df5',
    borderRadius: 10,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    opacity: 0.7,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  actionErrorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fdeaea',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  actionErrorText: {
    color: '#d64545',
    fontSize: 13,
    flex: 1,
  },
  dismissText: {
    color: '#d64545',
    fontSize: 14,
    fontWeight: '700',
    paddingLeft: 10,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  toolbarTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5a5f6e',
  },
  refreshButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4f6df5',
  },
  refreshDisabled: {
    opacity: 0.6,
  },
  refreshText: {
    color: '#4f6df5',
    fontSize: 12,
    fontWeight: '700',
  },
  errorBox: {
    backgroundColor: '#fdeaea',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
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
    fontSize: 12,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e6e8ee',
  },
  spinner: {
    width: 26,
    height: 26,
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#4f6df5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxDone: {
    backgroundColor: '#4f6df5',
    borderColor: '#4f6df5',
  },
  checkmark: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 18,
  },
  rowBody: {
    flex: 1,
    marginRight: 8,
  },
  rowTitle: {
    fontSize: 15,
    color: '#1f2330',
    fontWeight: '500',
  },
  rowTitleDone: {
    color: '#a5aab5',
    textDecorationLine: 'line-through',
  },
  rowDate: {
    fontSize: 12,
    color: '#a5aab5',
    marginTop: 2,
  },
  iconButton: {
    padding: 8,
  },
  iconText: {
    color: '#5a5f6e',
    fontSize: 14,
  },
  deleteText: {
    color: '#d64545',
    fontSize: 14,
  },
  editRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#4f6df5',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 14,
    color: '#1f2330',
    backgroundColor: '#fafbff',
  },
  miniButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: '#4f6df5',
  },
  saveText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#d9dce3',
  },
  cancelText: {
    color: '#5a5f6e',
    fontSize: 12,
    fontWeight: '600',
  },
  empty: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyBox: {
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 36,
    marginBottom: 6,
  },
  emptyText: {
    color: '#5a5f6e',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyHint: {
    color: '#a5aab5',
    fontSize: 12,
    marginTop: 4,
  },
});
