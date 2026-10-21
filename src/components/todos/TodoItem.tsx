import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import DateField from '../DateField';
import { cardShadow, theme } from '../../theme';
import { Todo } from '../../types';
import { isDone } from './todoUtils';

interface TodoItemProps {
  item: Todo;
  editingId: string | null;
  editText: string;
  editDate: string;
  busyId: string | null;
  onToggle: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
  onStartEdit: (todo: Todo) => void;
  onCancelEdit: () => void;
  onEditTextChange: (value: string) => void;
  onEditDateChange: (value: string) => void;
  onSaveEdit: () => void;
}

export function TodoItem({
  item,
  editingId,
  editText,
  editDate,
  busyId,
  onToggle,
  onDelete,
  onStartEdit,
  onCancelEdit,
  onEditTextChange,
  onEditDateChange,
  onSaveEdit,
}: TodoItemProps) {
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
              onChangeText={onEditTextChange}
              autoFocus
              onSubmitEditing={onSaveEdit}
              returnKeyType="done"
            />
            {busy ? (
              <ActivityIndicator size="small" color={theme.primary} />
            ) : null}
          </View>
          <View style={styles.editRow}>
            <DateField value={editDate} onChange={onEditDateChange} />
            <View style={styles.editButtons}>
              <Pressable
                style={[styles.miniButton, styles.saveButton]}
                onPress={onSaveEdit}
              >
                <Text style={styles.saveText}>Save</Text>
              </Pressable>
              <Pressable
                style={[styles.miniButton, styles.cancelButton]}
                onPress={onCancelEdit}
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
              onPress={() => onToggle(item)}
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
              <Text style={styles.rowDate}>{item.date}</Text>
            </View>
          </View>
          <Pressable
            style={styles.iconButton}
            onPress={() => onStartEdit(item)}
            disabled={busy}
            accessibilityLabel="Edit todo"
          >
            <Text style={styles.iconText}>✎</Text>
          </Pressable>
          <Pressable
            style={styles.iconButton}
            onPress={() => onDelete(item)}
            disabled={busy}
            accessibilityLabel="Delete todo"
          >
            <Text style={styles.iconDelete}>🗑</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
    fontSize: theme.font.title,
  },
  iconDelete: {
    fontSize: theme.font.title,
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
});
