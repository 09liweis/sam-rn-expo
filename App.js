import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, FlatList, Button } from "react-native";
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
  const [title, setTitle] = useState(true);
  const [counter, setCounter] = useState(2);

  useEffect(() => {
    getMoviesFromApiAsync();
  }, []);
  return (
    <View style={styles.container}>
      <Button
        title={`Counter: ${counter}`}
        onPress={() => setCounter(counter * counter)}
      />
      <Button
        title={title ? "I am a button" : "I am siri"}
        onPress={() => {
          setTitle(!title);
        }}
      ></Button>
      <Text style={styles.text}>Siri hate Movies</Text>
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
    backgroundColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
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
