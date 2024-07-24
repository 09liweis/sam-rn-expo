import { router } from "expo-router";
import { Text, View, StyleSheet, Image, Pressable } from "react-native";
import {
  FontAwesome6,
  Ionicons,
  AntDesign,
  MaterialIcons,
} from "@expo/vector-icons";
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
  food: <Ionicons name="restaurant" size={24} color="green" />,
  gift: <AntDesign name="gift" size={24} color="#989884" />,
  home: <AntDesign name="home" size={24} color="black" />,
  grocery: <MaterialIcons name="local-grocery-store" size={24} color="blue" />,
  fuel: <MaterialIcons name="local-gas-station" size={24} color="gray" />,
  travel: <MaterialIcons name="card-travel" size={24} color="orange" />,
  clothes: <Ionicons name="shirt" size={24} color="pink" />,
  internet: <AntDesign name="wifi" size={24} color="purple" />,
  canada: <FontAwesome6 name="canadian-maple-leaf" size={24} color="red" />,
};

const Price = ({ price }: { price: string }) => (
  <Text style={{ color: "red" }}>{price}</Text>
);

export default function CategoryItem({ categoryItem }: any) {
  const { category, total, items } = categoryItem;
  return (
    <View
      style={{
        borderWidth: 2,
        borderRadius: 10,
        borderColor: MD2Colors.red700,
        marginTop: 10,
      }}
      key={category}
    >
      <View style={styles.categoryTotal}>
        <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
          {ICON_MAPS[category]}
          <Text style={{ textTransform: "capitalize" }}>{category}</Text>
        </View>
        <Price price={total} />
      </View>
      {items.map(({ id, date, price, place }: Expense) => (
        <View key={id} style={styles.expenseItem}>
          <Text>{date}</Text>
          <Price price={price} />
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
    padding: 5,
    borderBottomWidth:2,
    borderColor:MD2Colors.red700
  },
});
