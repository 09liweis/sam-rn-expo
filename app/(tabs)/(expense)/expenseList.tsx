import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { fetchData } from "src/utils";

const URL = "https://samliweisen.onrender.com/api/transactions/statistics";

const ICON_MAPS: { [key: string]: string } = {
  food: "yelp",
  gift: "gift",
  home: "home",
  grocery: "shopping-basket",
  fuel: "car",
  travel: "plane",
  clothes: "shirtsinbulk",
  internet: "wifi",
  canada: "cc-visa",
};

type Expense = {
  id:string,
  price:string,
  date:string,
  category:string,
  place:any
}

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

  const renderExpenses = ({ item: { category, total, items } }: any) => (
    <View key={category}>
      <View style={styles.categoryTotal}>
        <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
          <FontAwesome size={28} name={ICON_MAPS[category]} />
          <Text style={{ textTransform: "capitalize" }}>{category}</Text>
        </View>
        <Text>{total}</Text>
      </View>
      {items.map(({ id, date, price, category, place }:Expense) => (
        <View key={id} style={styles.expenseItem}>
          <Text>{date}</Text>
          <Text>{price}</Text>
        </View>
      ))}
    </View>
  );

  useEffect(() => {
    getExpenses();
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar />
      <Text>Total Expenses {totals}</Text>
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
  expenseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
  },
  categoryTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: MD2Colors.amberA200,
    padding: 5,
  },
});
