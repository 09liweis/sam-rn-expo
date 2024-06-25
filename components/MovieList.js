import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, FlatList } from "react-native";
import MovieCard from "components/MovieCard";

export default function MovieList({ movies }) {
  return (
    <SafeAreaView style={styles.listArea}>
      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieCard movie={item} />}
        keyExtractor={(item) => item.title}
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
