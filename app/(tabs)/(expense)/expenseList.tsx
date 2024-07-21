import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ActivityIndicator, MD2Colors } from "react-native-paper";

export default function App() {
  const getMoviesFromApiAsync = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://samliweisen.onrender.com/api/transactions/statistics",
        {
          method:"POST",
          headers: {
            "Content-type": "application/json",
          },
        },
      );
      const json = await response.json();
      setMovies(json.movies);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    getMoviesFromApiAsync();
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar />
      <Text>Expenses</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: "auto",
    padding: 10,
    flex: 1,
  },
});
