import CategoryItem from "components/expense/CategoryItem";
import PageScreenContainer from "components/rental/ScreenContainer";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import { EXPENSES_STATISTICS_API } from "src/constant/api";
import { fetchData } from "src/utils";

const INITIAL_BALANCE = '$0.00';
const INITIAL_STATISTICS = {total:INITIAL_BALANCE,incomes:INITIAL_BALANCE,expenses:INITIAL_BALANCE};

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
  const [totals, setTotals] = useState(INITIAL_STATISTICS);

  const renderExpenses = ({ item }: any) => (
    <CategoryItem categoryItem={item} />
  );

  useEffect(() => {
    getExpenses();
  }, []);
  return (
    <PageScreenContainer>
      <View style={styles.container}>
        <View style={styles.expenseHeader}>

          <View>
            <Text>Expenses</Text>
            <Text>{totals.expenses}</Text>
          </View>

          <View>
            <Text style={styles.totalLabel}>Total Balances</Text>
            <Text style={styles.totalAmount}>{totals.total}</Text>
          </View>

          <View>
            <Text>Incomes</Text>
            <Text>{totals.incomes}</Text>
          </View>

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
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
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
    textAlign: 'center'
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center'
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});
