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
          <Text style={styles.movieTitle} numberOfLines={2}>{movie.title}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingLabel}>Rating:</Text>
            <View style={styles.ratingBadge}>
              <Text style={styles.doubanRating}>{movie.douban_rating}</Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  movieCard: {
    flexDirection: "row",
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  movieImage: {
    width: 100,
    height: 150,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  movieInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: 14,
    color: '#666666',
    marginRight: 8,
  },
  ratingBadge: {
    backgroundColor: '#fff3e0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  doubanRating: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ff9800',
  },
});
