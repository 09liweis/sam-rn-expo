import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, FlatList } from "react-native";
import MovieCard from "components/MovieCard";

export default function MovieList({ movies }) {
  return (
    <SafeAreaView style={styles.listArea}>
      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieCard movie={item} />}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        numColumns={2}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 8,
  },
});