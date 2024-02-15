import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import { ActivityIndicator, MD2Colors } from "react-native-paper";

export default function App() {
  return (
    <View style={styles.container}>
      <ActivityIndicator animating={true} size={"large"} />
      <Text style={styles.text}>Thats cool</Text>
      <Text>New Text</Text>
      <Image
        source={{
          uri: "https://m.media-amazon.com/images/M/MV5BMTY3Nzg2NjA1OF5BMl5BanBnXkFtZTgwMjY5NTU1MzI@._V1_FMjpg_UX309_.jpg",
        }}
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#876a7ef",
    fontFamily: "Arial",
    textTransform: "Capitalize",
  },
  image: {
    width: 75,
    height: 100,
  },
});
