import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { ActivityIndicator, MD2Colors } from "react-native-paper";

export default function App() {
  const getMoviesFromApiAsync = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://samliweisen.onrender.com/api/movies?limit=100",
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
      <Text style={styles.text}>Movies</Text>
      {loading ? (
        <ActivityIndicator animating={true} size={"medium"} />
      ) : (
        <Text>{movies.length}</Text>
      )}
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
