import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Button,
  SafeAreaView,
} from "react-native";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import MovieCard from "./components/MovieCard";

export default function App() {
  const getMoviesFromApiAsync = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://samliweisen.onrender.com/api/movies",
        {
          headers: {
            "Content-type": "application/json",
          },
        },
      );
      const json = await response.json();
      setMovies(json.movies);
    } catch (error) {
      console.error(error);
      setTitle(error.toString());
    }
    setLoading(false);
  };

  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [title, setTitle] = useState("Siri will like Movies");

  useEffect(() => {
    getMoviesFromApiAsync();
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar />
      <Text style={styles.text}>{title}</Text>
      {loading ? (
        <ActivityIndicator animating={true} size={"medium"} />
      ) : (
        <SafeAreaView style={styles.listArea}>
          <FlatList
            data={movies}
            renderItem={({ item }) => <MovieCard movie={item} />}
            keyExtractor={(item) => item._id}
          />
        </SafeAreaView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  listArea: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  text: {
    color: "tomato",
    fontFamily: "Arial",
    textTransform: "Capitalize",
  },
});
