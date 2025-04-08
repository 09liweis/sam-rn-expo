import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

export default function BalancePrice({label, amount,amountColor, amountSize=16}:{label:string,amount:string,amountColor?:string,amountSize?:number}) {
  return (
    <View style={styles.balanceItem}>
      <Text style={styles.balanceLabel}>{label}</Text>
      <Text style={[styles.balanceAmount,{color:amountColor,fontSize:amountSize}]}>{amount}</Text>
    </View>
  )
}

const styles = StyleSheet.create({  
  balanceItem: {
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  balanceAmount: {
    fontWeight: '600',
  },
});