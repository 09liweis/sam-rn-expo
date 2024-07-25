import CategoryItem from "components/expense/CategoryItem";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import { fetchData } from "src/utils";

const URL = "https://samliweisen.onrender.com/api/transactions/statistics";

export default function App() {
  const getExpenses = async () => {
    setLoading(true);

    try {
      const response = await fetchData({ url: URL, method: "POST" });
      setTotals(response.total);
      setExpenses(response.categoryPrice);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const [loading, setLoading] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [totals, setTotals] = useState("");

  const renderExpenses = ({ item }: any) => (
    <CategoryItem categoryItem={item} />
  );

  useEffect(() => {
    getExpenses();
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar />
      <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
        <Text>Total Expenses</Text>
        <Text style={{ color: "red", fontWeight: "bold" }}>{totals}</Text>
      </View>
      <FlatList data={expenses} renderItem={renderExpenses} />
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
});
