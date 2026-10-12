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
import { Expense, Statistics } from '../types';

function formatAmount(amount: number): string {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'number') {
    return Number.isInteger(value) ? String(value) : formatAmount(value);
  }
  if (typeof value === 'string' || typeof value === 'boolean') {
    return String(value);
  }
  return JSON.stringify(value);
}

function StatisticsCard({ data }: { data: Statistics }) {
  const entries = Object.entries(data);
  if (entries.length === 0) {
    return <Text style={styles.statisticsEmpty}>No data</Text>;
  }
  return (
    <View style={styles.statisticsTable}>
      {entries.map(([key, value]) => (
        <View key={key} style={styles.statisticsRow}>
          <Text style={styles.statisticsKey}>{key}</Text>
          <Text style={styles.statisticsValue} numberOfLines={2}>
            {formatValue(value)}
          </Text>
        </View>
      ))}
    </View>
  );
}

export default function ExpenseScreen() {
  const {
    expenses,
    addExpense,
    removeExpense,
    totalExpense,
    statistics,
    statisticsLoading,
    statisticsError,
    fetchStatistics,
    user,
  } = useApp();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');

  // Fetch statistics every time the user switches to the expense tab
  useEffect(() => {
    if (user) {
      void fetchStatistics();
    }
  }, [user, fetchStatistics]);

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

      <View style={styles.statisticsCard}>
        <View style={styles.statisticsHeader}>
          <Text style={styles.statisticsTitle}>Statistics</Text>
          <Pressable
            style={[styles.statisticsRefresh, statisticsLoading && styles.statisticsRefreshDisabled]}
            onPress={() => void fetchStatistics()}
            disabled={statisticsLoading}
          >
            {statisticsLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.statisticsRefreshText}>Refresh</Text>
            )}
          </Pressable>
        </View>
        {statisticsError ? (
          <View style={styles.statisticsErrorBox}>
            <Text style={styles.statisticsErrorText}>{statisticsError}</Text>
            <Pressable
              style={styles.statisticsRetry}
              onPress={() => void fetchStatistics()}
            >
              <Text style={styles.statisticsRetryText}>Retry</Text>
            </Pressable>
          </View>
        ) : statistics ? (
          <StatisticsCard data={statistics} />
        ) : statisticsLoading ? (
          <ActivityIndicator color="#fff" style={{ marginVertical: 10 }} />
        ) : null}
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
  statisticsCard: {
    backgroundColor: '#4f6df5',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  statisticsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statisticsTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  statisticsRefresh: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  statisticsRefreshDisabled: {
    opacity: 0.6,
  },
  statisticsRefreshText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  statisticsTable: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statisticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  statisticsKey: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
    fontWeight: '500',
    marginRight: 12,
  },
  statisticsValue: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
  },
  statisticsEmpty: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 6,
  },
  statisticsErrorBox: {
    backgroundColor: 'rgba(214, 69, 69, 0.85)',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  statisticsErrorText: {
    color: '#fff',
    fontSize: 13,
    marginBottom: 6,
    textAlign: 'center',
  },
  statisticsRetry: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  statisticsRetryText: {
    color: '#d64545',
    fontSize: 12,
    fontWeight: '700',
  },
  totalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e6e8ee',
  },
  totalLabel: {
    color: '#5a5f6e',
    fontSize: 14,
    fontWeight: '600',
  },
  totalValue: {
    color: '#1f2330',
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
