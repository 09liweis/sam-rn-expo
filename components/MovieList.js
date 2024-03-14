import { StatusBar } from "expo-status-bar";
import { SafeAreaView, View, StyleSheet, FlatList } from "react-native";
import MovieCard from "./MovieCard";

export default function MovieList({ movies }) {
  return (
    <SafeAreaView style={styles.listArea}>
      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieCard movie={item} />}
        keyExtractor={(item) => item._id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listArea: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
});
