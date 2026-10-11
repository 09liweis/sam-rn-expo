import React, { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { Todo } from '../types';

export default function TodoScreen() {
  const { todos, addTodo, toggleTodo, removeTodo } = useApp();
  const [title, setTitle] = useState('');

  const handleAdd = () => {
    const text = title.trim();
    if (!text) return;
    addTodo(text);
    setTitle('');
  };

  const renderItem = ({ item }: { item: Todo }) => (
    <View style={styles.row}>
      <Pressable
        style={styles.checkbox}
        onPress={() => toggleTodo(item.id)}
        accessibilityLabel={item.done ? 'Mark as not done' : 'Mark as done'}
      >
        {item.done ? <Text style={styles.checkmark}>✓</Text> : null}
      </Pressable>
      <Text style={[styles.rowTitle, item.done && styles.rowTitleDone]}>
        {item.title}
      </Text>
      <Pressable
        style={styles.deleteButton}
        onPress={() => removeTodo(item.id)}
        accessibilityLabel="Delete todo"
      >
        <Text style={styles.deleteText}>✕</Text>
      </Pressable>
    </View>
  );

  const remaining = todos.filter((t) => !t.done).length;

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="What needs to be done?"
          value={title}
          onChangeText={setTitle}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
        />
        <Pressable style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </View>

      <Text style={styles.summary}>
        {todos.length === 0
          ? 'No todos yet'
          : `${remaining} of ${todos.length} remaining`}
      </Text>

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={todos.length === 0 && styles.empty}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Add your first todo above ☝️</Text>
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
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
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
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  summary: {
    fontSize: 13,
    color: '#8a8f9e',
    marginBottom: 8,
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
  checkmark: {
    color: '#4f6df5',
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 18,
  },
  rowTitle: {
    flex: 1,
    fontSize: 15,
    color: '#1f2330',
  },
  rowTitleDone: {
    color: '#a5aab5',
    textDecorationLine: 'line-through',
  },
  deleteButton: {
    padding: 6,
  },
  deleteText: {
    color: '#d64545',
    fontSize: 14,
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
