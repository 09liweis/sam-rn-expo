import CategoryItem from "components/expense/CategoryItem";
import PageScreenContainer from "components/rental/ScreenContainer";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { ActivityIndicator, MD2Colors, IconButton } from "react-native-paper";
import { EXPENSES_STATISTICS_API } from "src/constant/api";
import { fetchData } from "src/utils";
import { format } from 'date-fns';
import { MotiView } from "moti";

const INITIAL_BALANCE = '$0.00';
const INITIAL_STATISTICS = {total:INITIAL_BALANCE,incomes:INITIAL_BALANCE,expenses:INITIAL_BALANCE};

export default function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getExpenses = async (date = selectedDate) => {
    setLoading(true);

    try {
      const monthYear = format(date, 'yyyy-MM');
      const {total, incomes, expenses, categoryPrice} = await fetchData({ 
        url: EXPENSES_STATISTICS_API, 
        method: "POST",
        body: { date: monthYear }
      });
      setTotals({total, incomes, expenses});
      setExpenses(categoryPrice);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handlePreviousMonth = () => {
    const newDate = new Date(selectedDate.setMonth(selectedDate.getMonth() - 1));
    setSelectedDate(newDate);
    getExpenses(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(selectedDate.setMonth(selectedDate.getMonth() + 1));
    setSelectedDate(newDate);
    getExpenses(newDate);
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
          <View style={styles.balanceContainer}>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>Expenses</Text>
              <Text style={styles.expenseAmount}>{totals.expenses}</Text>
            </View>

            <View style={styles.balanceItem}>
              <Text style={styles.totalLabel}>Total Balance</Text>
              <Text style={styles.totalAmount}>{totals.total}</Text>
            </View>

            <View style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>Incomes</Text>
              <Text style={styles.incomeAmount}>{totals.incomes}</Text>
            </View>
          </View>
        </View>

        <View style={styles.dateSelector}>
          <IconButton
            icon="chevron-left"
            size={24}
            onPress={handlePreviousMonth}
          />
          <Text style={styles.dateText}>
            {format(selectedDate, 'MMMM yyyy')}
          </Text>
          <IconButton
            icon="chevron-right"
            size={24}
            onPress={handleNextMonth}
          />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={MD2Colors.blue500} />
          </View>
        ) : 
        <MotiView 
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 200 }}
        >
        <FlatList
          data={expenses}
          renderItem={renderExpenses}
          // keyExtractor={(item) => item.category}
          showsVerticalScrollIndicator={false}
        />
        </MotiView>}
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
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginHorizontal: 8,
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  balanceItem: {
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc2626',
  },
  incomeAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#16a34a',
  },
});
