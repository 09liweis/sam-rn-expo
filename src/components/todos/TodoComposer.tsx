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

interface TodoComposerProps {
  newTitle: string;
  setNewTitle: (value: string) => void;
  newDate: string;
  setNewDate: (value: string) => void;
  adding: boolean;
  onAdd: () => void;
}

export function TodoComposer({
  newTitle,
  setNewTitle,
  newDate,
  setNewDate,
  adding,
  onAdd,
}: TodoComposerProps) {
  return (
    <View style={[styles.addCard, cardShadow.shadow]}>
      <TextInput
        style={styles.addInput}
        placeholder="What needs to be done?"
        placeholderTextColor={theme.textFaint}
        value={newTitle}
        onChangeText={setNewTitle}
        onSubmitEditing={onAdd}
        returnKeyType="done"
      />
      <DateField value={newDate} onChange={setNewDate} />
      <Pressable
        style={({ pressed }) => [
          styles.addButton,
          (adding || pressed) && styles.addButtonPressed,
        ]}
        onPress={onAdd}
        disabled={adding}
      >
        {adding ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.addButtonText}>＋ Add</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
