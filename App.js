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

export default function App() {
  const getMoviesFromApiAsync = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://samliweisen.onrender.com/api/movies?limit=50",
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
      <Text style={styles.text}>Siri hate Movies</Text>
      {loading ? (
        <ActivityIndicator animating={true} size={"medium"} />
      ) : (
        <SafeAreaView style={styles.listArea}>
          <FlatList
            data={movies}
            renderItem={({ item }) => (
              <View style={styles.movieCard}>
                <Image source={{ uri: item.poster }} style={styles.image} />
                <Text>{item.title}</Text>
              </View>
            )}
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
    alignItems: "center",
    justifyContent: "center",
  },
  listArea: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  movieCard: {
    borderRadius: "30",
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  text: {
    color: "tomato",
    fontFamily: "Arial",
    textTransform: "Capitalize",
  },
  image: {
    width: 75,
    height: 100,
  },
});
