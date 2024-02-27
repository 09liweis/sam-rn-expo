import { Text, View, StyleSheet, Image } from "react-native";

export default function MovieCard({ movie }) {
  return (
    <View style={styles.movieCard}>
      <Image source={{ uri: movie.poster }} style={styles.movieImage} />
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle}>{movie.title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  movieCard: {
    width: "100%",
    flexDirection: "row",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20,
  },
  movieImage: {
    width: "35%",
    aspectRatio: "3/4",
    borderRadius: 10,
  },
  movieInfo: {
    padding: 20,
  },
  movieTitle: {
    fontSize: 18,
  },
});
