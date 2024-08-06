import CategoryItem from "components/expense/CategoryItem";
import { Chart } from "components/expense/Chart";
import PageScreenContainer from "components/rental/ScreenContainer";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
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
  const [view, setView] = useState("list");

  const renderExpenses = ({ item }: any) => (
    <CategoryItem categoryItem={item} />
  );

  useEffect(() => {
    getExpenses();
  }, []);
  return (
    <PageScreenContainer>
      <>
      <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
        <Text>Total Expenses</Text>
        <Text style={{ color: "red", fontWeight: "bold" }}>{totals}</Text>
      </View>
      <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
        <Pressable onPress={() => setView("list")}>
          <Text>View</Text>
        </Pressable>
        <Pressable onPress={() => setView("chart")}>
          <Text>Chart</Text>
        </Pressable>
      </View>
      {view === "list" ? (
        <FlatList data={expenses} renderItem={renderExpenses} />
      ) : (
        <Chart totals={totals} expenses={expenses} />
      )}
      </>
    </PageScreenContainer>
  );
}

const styles = StyleSheet.create({
  expensesContainer: {
    width: "100%",
  },
});
