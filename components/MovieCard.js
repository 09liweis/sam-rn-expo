import { router } from "expo-router";
import { Text, View, StyleSheet, Image, Pressable } from "react-native";

export default function MovieCard({ movie }) {
  const { douban_id, title } = movie;
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "movieDetail",
          params: { douban_id: douban_id, title },
        })
      }
    >
      <View style={styles.movieCard}>
        <Image source={{ uri: movie.poster }} style={styles.movieImage} />
        <View style={styles.movieInfo}>
          <Text style={styles.movieTitle}>{movie.title}</Text>
          <Text style={styles.doubanRating}>{movie.douban_rating}</Text>
        </View>
      </View>
    </Pressable>
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
    position: "relative",
    width: "65%",
    padding: 15,
  },
  movieTitle: {
    fontSize: 18,
  },
  doubanRating: {
    top: 0,
    right: 0,
    borderTopRightRadius: 10,
    position: "absolute",
    color: "#fff",
    padding: 5,
    backgroundColor: "green",
  },
});
