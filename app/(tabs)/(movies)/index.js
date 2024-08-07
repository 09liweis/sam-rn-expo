import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import MovieList from "components/MovieList";

export default function App() {
  const getMoviesFromApiAsync = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://samliweisen.vercel.app/api/movies?imgserver=img9&limit=50",
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
        <MovieList movies={movies} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: "auto",
    maxWidth: "425px",
    padding: 10,
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
  },
  text: {
    color: "tomato",
    textTransform: "Capitalize",
    fontSize: 24,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
});
