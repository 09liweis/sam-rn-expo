import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import MovieList from "components/MovieList";
import { fetchData, showToast } from "src/utils";
import { MOVIES_API } from "src/constant/api";
import MovieCategories from "components/movie/MovieCategories";

export default function App() {
  const getMoviesFromApiAsync = async () => {
    setLoading(true);
    try {
      const moviesResponse = await fetchData({url: MOVIES_API});
      setMovies(moviesResponse.movies);
    } catch (error) {
      showToast(error.toString());
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
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <MovieCategories />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff9800" />
        </View>
      ) : (
        <MovieList movies={movies} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
