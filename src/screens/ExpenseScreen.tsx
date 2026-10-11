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
import { Expense } from '../types';

function formatAmount(amount: number): string {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
}

export default function ExpenseScreen() {
  const { expenses, addExpense, removeExpense, totalExpense } = useApp();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');

  const handleAdd = () => {
    const name = title.trim();
    const value = Number.parseFloat(amount);
    if (!name) return;
    if (Number.isNaN(value) || value <= 0) return;
    addExpense(name, value);
    setTitle('');
    setAmount('');
  };

  const renderItem = ({ item }: { item: Expense }) => (
    <View style={styles.row}>
      <View style={styles.rowInfo}>
        <Text style={styles.rowTitle}>{item.title}</Text>
        <Text style={styles.rowDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.rowAmount}>{formatAmount(item.amount)}</Text>
      <Pressable
        style={styles.deleteButton}
        onPress={() => removeExpense(item.id)}
        accessibilityLabel="Delete expense"
      >
        <Text style={styles.deleteText}>✕</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, styles.titleInput]}
          placeholder="Expense title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[styles.input, styles.amountInput]}
          placeholder="Amount"
          value={amount}
          onChangeText={(text) => setAmount(text.replace(/[^0-9.]/g, ''))}
          keyboardType="decimal-pad"
        />
        <Pressable style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </View>

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total spent</Text>
        <Text style={styles.totalValue}>{formatAmount(totalExpense)}</Text>
      </View>

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={expenses.length === 0 && styles.empty}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No expenses recorded yet</Text>
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
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d9dce3',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: '#fff',
    color: '#1f2330',
  },
  titleInput: {
    flex: 2,
  },
  amountInput: {
    flex: 1,
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
  totalCard: {
    backgroundColor: '#4f6df5',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 14,
    fontWeight: '600',
  },
  totalValue: {
    color: '#fff',
    fontSize: 20,
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
  rowAmount: {
    fontSize: 15,
    fontWeight: '600',
    color: '#d64545',
    marginRight: 10,
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
