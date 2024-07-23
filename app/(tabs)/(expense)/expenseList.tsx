import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ActivityIndicator, MD2Colors } from "react-native-paper";

export default function App() {
  const getExpenses = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://samliweisen.onrender.com/api/transactions/statistics",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
        },
      );
      const json = await response.json();
      setTotals(json.total);
      setExpenses(json.categoryPrice);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const [loading, setLoading] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [totals, setTotals] = useState("");

  const renderExpenses = expenses.map(({ category, total, items }) => (
    <View key={category}>
      <View style={styles.categoryTotal}>
        <Text>{category}</Text>
        <Text>{total}</Text>
      </View>
      {items.map(({id,date,price,category,place})=>
      <View key={id} style={styles.expenseItem}>
        <Text>{date}</Text>
        <Text>{price}</Text>
      </View>
      )}
    </View>
  ));

  useEffect(() => {
    getExpenses();
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar />
      <Text>Total Expenses {totals}</Text>
      {renderExpenses}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  expensesContainer: {
    width: "100%",
  },
  expenseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5
  },
  categoryTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: MD2Colors.amberA200,
    padding: 5
  },
});
