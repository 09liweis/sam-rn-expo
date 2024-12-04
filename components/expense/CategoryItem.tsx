import { router } from "expo-router";
import { Text, View, StyleSheet, Image, Pressable } from "react-native";
import {
  FontAwesome6,
  Ionicons,
  AntDesign,
  MaterialIcons,
} from "@expo/vector-icons";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import { CategoryItemProps, Expense } from "src/types/expenseType";

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
  <Text style={styles.price}>${price}</Text>
);

export default function CategoryItem({ categoryItem }: CategoryItemProps) {
  const { category, total, items, percentage } = categoryItem;
  return (
    <View style={styles.expenseItem}>
      <View style={styles.leftContent}>
        <View style={styles.iconContainer}>
          {ICON_MAPS[category] || <AntDesign name="questioncircleo" size={24} color="#666" />}
        </View>
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryName}>{category}</Text>
          <Text style={styles.itemCount}>{items.length} items</Text>
        </View>
      </View>
      <View style={styles.rightContent}>
        <Price price={total} />
        <Text style={styles.percentage}>{percentage}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  expenseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: '#ffffff',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    textTransform: 'capitalize',
  },
  itemCount: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#e32f45',
    marginBottom: 2,
  },
  percentage: {
    fontSize: 14,
    color: '#666666',
  },
});
