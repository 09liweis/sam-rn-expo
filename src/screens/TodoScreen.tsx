import React, { useEffect, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { toISODate } from '../components/DateField';
import { TodoComposer } from '../components/todos/TodoComposer';
import { TodoItem } from '../components/todos/TodoItem';
import { TodoToolbar } from '../components/todos/TodoToolbar';
import { isDone, nextStatus } from '../components/todos/todoUtils';
import { cardShadow, theme } from '../theme';
import { Todo } from '../types';

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
  const [addModalVisible, setAddModalVisible] = useState(false);

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
      setAddModalVisible(false);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to add todo');
    } finally {
      setAdding(false);
    }
  };

  const closeAddModal = () => {
    if (adding) return;
    setAddModalVisible(false);
    setNewTitle('');
    setNewDate(today);
    setActionError(null);
  };

  const openAddModal = () => {
    setActionError(null);
    setNewDate(today);
    setAddModalVisible(true);
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
    setEditDate(/^\d{4}-\d{2}-\d{2}/.test(todo.date)
      ? todo.date.slice(0, 10)
      : today);
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

  const remaining = todos.filter((t) => !isDone(t.status)).length;

  return (
    <View style={styles.container}>
      <Modal
        visible={addModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeAddModal}
      >
        <KeyboardAvoidingView
          style={styles.modalBackdrop}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={closeAddModal}
            accessibilityLabel="Close add todo dialog"
            accessibilityRole="button"
          />
          <View style={[styles.modalCard, cardShadow.shadow]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add a todo</Text>
              <Pressable
                onPress={closeAddModal}
                disabled={adding}
                hitSlop={10}
                accessibilityLabel="Close"
                accessibilityRole="button"
              >
                <Text style={styles.modalClose}>✕</Text>
              </Pressable>
            </View>
            <TodoComposer
              newTitle={newTitle}
              setNewTitle={setNewTitle}
              newDate={newDate}
              setNewDate={setNewDate}
              adding={adding}
              onAdd={() => void handleAdd()}
            />
            {actionError ? (
              <View style={styles.actionErrorBox}>
                <Text style={styles.actionErrorText}>{actionError}</Text>
                <Pressable onPress={() => setActionError(null)} hitSlop={8}>
                  <Text style={styles.dismissText}>✕</Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {actionError && !addModalVisible ? (
        <View style={styles.actionErrorBox}>
          <Text style={styles.actionErrorText}>{actionError}</Text>
          <Pressable onPress={() => setActionError(null)} hitSlop={8}>
            <Text style={styles.dismissText}>✕</Text>
          </Pressable>
        </View>
      ) : null}

      <TodoToolbar
        remaining={remaining}
        total={todos.length}
        loading={todosLoading}
        onRefresh={() => void fetchTodos()}
        onAdd={openAddModal}
      />

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
        renderItem={({ item }) => (
          <TodoItem
            item={item}
            editingId={editingId}
            editText={editText}
            editDate={editDate}
            busyId={busyId}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onStartEdit={startEdit}
            onCancelEdit={cancelEdit}
            onEditTextChange={setEditText}
            onEditDateChange={setEditDate}
            onSaveEdit={() => void saveEdit()}
          />
        )}
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
    padding: 20,
    backgroundColor: theme.bg,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(17, 24, 39, 0.45)',
  },
  modalCard: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    backgroundColor: theme.surface,
    borderRadius: theme.radius.lg,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalTitle: {
    color: theme.ink,
    fontSize: theme.font.title,
    fontWeight: '800',
  },
  modalClose: {
    color: theme.textFaint,
    fontSize: theme.font.body,
    fontWeight: '700',
    padding: 4,
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
