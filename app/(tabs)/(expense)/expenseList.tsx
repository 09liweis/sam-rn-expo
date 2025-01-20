import CategoryItem from "components/expense/CategoryItem";
import { Chart } from "components/expense/Chart";
import PageScreenContainer from "components/rental/ScreenContainer";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import { EXPENSES_STATISTICS_API } from "src/constant/api";
import { fetchData } from "src/utils";

export default function App() {
  const getExpenses = async () => {
    setLoading(true);

    try {
      const {total, incomes, expenses, categoryPrice} = await fetchData({ url: EXPENSES_STATISTICS_API, method: "POST" });
      setTotals({total, incomes, expenses});
      setExpenses(categoryPrice);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const [loading, setLoading] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [totals, setTotals] = useState({total:'',incomes:'',expenses:''});
  const [view, setView] = useState("list");

  const renderExpenses = ({ item }: any) => (
    <CategoryItem categoryItem={item} />
  );

  useEffect(() => {
    getExpenses();
  }, []);
  return (
    <PageScreenContainer>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.totalLabel}>Total Balances</Text>
          <Text style={styles.totalAmount}>{totals.total}</Text>

          <Text style={styles.totalLabel}>Total Expenses</Text>
          <Text style={styles.totalAmount}>{totals.expenses}</Text>

          <Text style={styles.totalLabel}>Total Income</Text>
          <Text style={styles.totalAmount}>{totals.incomes}</Text>

        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={MD2Colors.blue500} />
          </View>
        ) : 
        <FlatList
          data={expenses}
          renderItem={renderExpenses}
          // keyExtractor={(item) => item.category}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />}
      </View>
    </PageScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  totalLabel: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 16,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  activeToggle: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666666',
  },
  activeToggleText: {
    color: '#1a1a1a',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    flex: 1,
  },
});
