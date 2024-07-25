import { Text, View } from "react-native";
import { PieChart, BarChart } from "react-native-gifted-charts";
export const Chart = ({ totals, expenses }) => {
  const data = expenses.map((categoryPrice) => {
    const priceValue = parseFloat(categoryPrice.total.replace("$", ""));
    const categoryPrecentage = (priceValue * 100 / parseFloat(totals.replace("$", ""))).toFixed()+"%";
    return {
      label: categoryPrice.category,
      value: priceValue,
      topLabelComponent: () => (
        <Text style={{ fontSize: 18, marginBottom: 6 }}>
          {categoryPrecentage}
        </Text>
      ),
    };
  });

  return (
    <View>
      <BarChart
        height={500}
        width={1000}
        barWidth={40}
        noOfSections={6}
        barBorderRadius={4}
        //showGradient
        frontColor={"#1B6BB0"}
        gradientColor={"#FFEEFE"}
        data={data}
        isAnimated
        yAxisThickness={0}
        xAxisThickness={0}
      />
    </View>
  );
};
