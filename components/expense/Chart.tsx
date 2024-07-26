import { Dimensions, Text, View } from "react-native";
import { PieChart, BarChart } from "react-native-gifted-charts";

const {width, height} = Dimensions.get("screen");

export const Chart = ({ totals, expenses }) => {
  const data = expenses.map((categoryPrice) => {
    const priceValue = parseFloat(categoryPrice.total.replace("$", ""));
    const categoryPrecentage =
      ((priceValue * 100) / parseFloat(totals.replace("$", ""))).toFixed() +
      "%";
    return {
      value: priceValue,
      labelComponent: () => (
        <Text style={{fontSize:12, textAlign: "center", textTransform: "capitalize" }}>
          {categoryPrice.category}
        </Text>
      ),
      topLabelComponent: () => (
        <Text style={{ fontSize: 18, marginBottom: 6 }}>
          {categoryPrecentage}
        </Text>
      ),
    };
  });

  return (
    <BarChart
      height={height/2}
      width={width}
      barWidth={30}
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
  );
};
