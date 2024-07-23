import { router } from "expo-router";
import { Text, View, StyleSheet, Image, Pressable } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ActivityIndicator, MD2Colors } from "react-native-paper";



type CategoryItemProps = {
  category: string;
  total: string;
  items: any[];
}

type Expense = {
  id:string,
  price:string,
  date:string,
  category:string,
  place:any
}

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

export default function CategoryItem({ categoryItem }:any) {
  const {category,total,items} = categoryItem;
  return (
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
