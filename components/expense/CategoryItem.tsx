import { router } from "expo-router";
import { Text, View, StyleSheet, Image, Pressable } from "react-native";
import {FontAwesome6,Ionicons,AntDesign,MaterialIcons} from "@expo/vector-icons";
import { ActivityIndicator, MD2Colors } from "react-native-paper";

type CategoryItemProps = {
  category: string;
  total: string;
  items: any[];
};

type Expense = {
  id: string;
  price: string;
  date: string;
  category: string;
  place: any;
};

const ICON_MAPS: { [key: string]: any } = {
  food: <Ionicons name="restaurant" size={24} color="black" />,
  gift: <AntDesign name="gift" size={24} color="black" />,
  home: <AntDesign name="home" size={24} color="black" />,
  grocery: <MaterialIcons name="local-grocery-store" size={24} color="black" />,
  fuel: <MaterialIcons name="local-gas-station" size={24} color="black" />,
  travel: <MaterialIcons name="card-travel" size={24} color="black" />,
  clothes: <Ionicons name="shirt" size={24} color="black" />,
  internet: <AntDesign name="wifi" size={24} color="black" />,
  canada: <FontAwesome6 name="canadian-maple-leaf" size={24} color="black" />,
};

export default function CategoryItem({ categoryItem }: any) {
  const { category, total, items } = categoryItem;
  return (
    <View key={category}>
      <View style={styles.categoryTotal}>
        <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
          {ICON_MAPS[category]}
          <Text style={{ textTransform: "capitalize" }}>{category}</Text>
        </View>
        <Text>{total}</Text>
      </View>
      {items.map(({ id, date, price, category, place }: Expense) => (
        <View key={id} style={styles.expenseItem}>
          <Text>{date}</Text>
          <Text>{price}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
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
