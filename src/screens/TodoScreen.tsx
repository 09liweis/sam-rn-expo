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
import DateField, { toISODate } from '../components/DateField';
import { theme } from '../theme';
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
    weekday: 'short',
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

  const today = toISODate(new Date());

  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(today);
  const [adding, setAdding] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editDate, setEditDate] = useState(today);

  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

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
      await addTodo(name, newDate);
      setNewTitle('');
      setNewDate(today);
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
    setEditDate(/^\d{4}-\d{2}-\d{2}/.test(todo.date) ? todo.date.slice(0, 10) : today);
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
      await updateTodo(id, { name, date: editDate });
      setEditingId(null);
      setEditText('');
    });
  };

  const renderItem = ({ item }: { item: Todo }) => {
    const done = isDone(item.status);
    const busy = busyId === item._id;
    const editing = editingId === item._id;

    return (
      <View style={[styles.row, cardShadow.shadow, editing && styles.rowEditing]}>
        {editing ? (
          <View style={styles.editContainer}>
            <View style={styles.editRow}>
              <TextInput
                style={styles.editInput}
                value={editText}
                onChangeText={setEditText}
                autoFocus
                onSubmitEditing={() => void saveEdit()}
                returnKeyType="done"
              />
              {busy ? (
                <ActivityIndicator size="small" color={theme.primary} />
              ) : null}
            </View>
            <View style={styles.editRow}>
              <DateField value={editDate} onChange={setEditDate} />
              <View style={styles.editButtons}>
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
            </View>
          </View>
        ) : (
          <>
            {busy ? (
              <ActivityIndicator size="small" color={theme.primary} />
            ) : (
              <Pressable
                style={[styles.checkbox, done && styles.checkboxDone]}
                onPress={() => handleToggle(item)}
                accessibilityLabel={done ? 'Mark as pending' : 'Mark as done'}
              >
                {done ? <Text style={styles.checkmark}>✓</Text> : null}
              </Pressable>
            )}
            <View style={styles.rowBody}>
              <Text style={[styles.rowTitle, done && styles.rowTitleDone]}>
                {item.name}
              </Text>
              <View style={styles.rowMeta}>
                <Text style={styles.rowDateIcon}>📅</Text>
                <Text style={styles.rowDate}>{formatDate(item.date)}</Text>
              </View>
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
              <Text style={styles.iconDelete}>🗑</Text>
            </Pressable>
          </>
        )}
      </View>
    );
  };

  const remaining = todos.filter((t) => !isDone(t.status)).length;

  return (
    <View style={styles.container}>
      <View style={[styles.addCard, cardShadow.shadow]}>
        <TextInput
          style={styles.addInput}
          placeholder="What needs to be done?"
          placeholderTextColor={theme.textFaint}
          value={newTitle}
          onChangeText={setNewTitle}
          onSubmitEditing={() => void handleAdd()}
          returnKeyType="done"
        />
        <View style={styles.addControls}>
          <DateField value={newDate} onChange={setNewDate} />
          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              (adding || pressed) && styles.addButtonPressed,
            ]}
            onPress={() => void handleAdd()}
            disabled={adding}
          >
            {adding ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.addButtonText}>＋ Add</Text>
            )}
          </Pressable>
        </View>
      </View>

      {actionError ? (
        <View style={styles.actionErrorBox}>
          <Text style={styles.actionErrorText}>{actionError}</Text>
          <Pressable onPress={() => setActionError(null)} hitSlop={8}>
            <Text style={styles.dismissText}>✕</Text>
          </Pressable>
        </View>
      ) : null}

      <View style={styles.toolbar}>
        <View>
          <Text style={styles.toolbarTitle}>My Todos</Text>
          <Text style={styles.toolbarSubtitle}>
            {todos.length === 0
              ? 'Nothing here yet'
              : `${remaining} of ${todos.length} remaining`}
          </Text>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.refreshButton,
            (todosLoading || pressed) && styles.refreshPressed,
          ]}
          onPress={() => void fetchTodos()}
          disabled={todosLoading}
        >
          {todosLoading ? (
            <ActivityIndicator size="small" color={theme.primary} />
          ) : (
            <Text style={styles.refreshText}>↻</Text>
          )}
        </Pressable>
      </View>

      {todosError ? (
        <View style={[styles.errorBox, cardShadow.shadow]}>
          <Text style={styles.errorEmoji}>⚠️</Text>
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

const cardShadow = StyleSheet.create({
  shadow: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.bg,
  },
  addCard: {
    backgroundColor: theme.surface,
    borderRadius: theme.radius.lg,
    padding: 14,
    gap: 10,
    marginBottom: 16,
  },
  addInput: {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: theme.font.body,
    backgroundColor: theme.bg,
    color: theme.ink,
  },
  addControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addButton: {
    backgroundColor: theme.primary,
    borderRadius: theme.radius.md,
    paddingHorizontal: 20,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonPressed: {
    opacity: 0.85,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: theme.font.body,
  },
  actionErrorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.redSoft,
    borderRadius: theme.radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  actionErrorText: {
    color: theme.red,
    fontSize: theme.font.caption,
    flex: 1,
  },
  dismissText: {
    color: theme.red,
    fontSize: theme.font.body,
    fontWeight: '700',
    paddingLeft: 10,
  },
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
  errorBox: {
    backgroundColor: theme.surface,
    borderRadius: theme.radius.lg,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
  },
  errorEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  errorText: {
    color: theme.red,
    fontSize: theme.font.caption,
    marginBottom: 10,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.red,
  },
  retryText: {
    color: '#fff',
    fontSize: theme.font.caption,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderRadius: theme.radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 10,
  },
  rowEditing: {
    borderWidth: 1.5,
    borderColor: theme.primary,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: theme.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  checkboxDone: {
    backgroundColor: theme.green,
    borderColor: theme.green,
  },
  checkmark: {
    color: '#fff',
    fontWeight: '800',
    fontSize: theme.font.body,
    lineHeight: 20,
  },
  rowBody: {
    flex: 1,
    marginRight: 8,
  },
  rowTitle: {
    fontSize: theme.font.body,
    color: theme.text,
    fontWeight: '600',
  },
  rowTitleDone: {
    color: theme.textFaint,
    textDecorationLine: 'line-through',
  },
  rowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  rowDateIcon: {
    fontSize: 10,
  },
  rowDate: {
    fontSize: theme.font.micro,
    color: theme.textFaint,
    fontWeight: '500',
  },
  iconButton: {
    padding: 7,
  },
  iconText: {
    color: theme.textFaint,
    fontSize: theme.font.body,
  },
  iconDelete: {
    fontSize: theme.font.caption,
  },
  editContainer: {
    flex: 1,
    gap: 8,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.primary,
    borderRadius: theme.radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: theme.font.body,
    color: theme.ink,
    backgroundColor: theme.bg,
  },
  editButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  miniButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.sm,
  },
  saveButton: {
    backgroundColor: theme.primary,
  },
  saveText: {
    color: '#fff',
    fontSize: theme.font.caption,
    fontWeight: '700',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: theme.border,
  },
  cancelText: {
    color: theme.textSoft,
    fontSize: theme.font.caption,
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
    fontSize: 42,
    marginBottom: 8,
  },
  emptyText: {
    color: theme.textSoft,
    fontSize: theme.font.body,
    fontWeight: '700',
  },
  emptyHint: {
    color: theme.textFaint,
    fontSize: theme.font.caption,
    marginTop: 4,
  },
});
