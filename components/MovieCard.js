import { router } from "expo-router";
import { Text, View, StyleSheet, Image, Pressable } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';

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
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed
      ]}
    >
      <View style={styles.movieCard}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: movie.poster }} 
            style={styles.movieImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          />
        </View>
        
        <View style={styles.contentContainer}>
          <View style={styles.movieInfo}>
            <Text style={styles.movieTitle} numberOfLines={2}>
              {movie.title}
            </Text>
            <Text style={styles.movieYear} numberOfLines={1}>
              {movie.year || "2024"}
            </Text>
          </View>

          <View style={styles.ratingContainer}>
            <AntDesign name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>
              {movie.douban_rating || "N/A"}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 8,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  movieCard: {
    overflow: 'hidden',
    borderRadius: 12,
    flexDirection: 'row'
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 2/3,
    width: '30%',
  },
  movieImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  contentContainer: {
    padding: 12,
  },
  movieInfo: {
    flex: 1,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
    lineHeight: 20,
  },
  movieYear: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFB800',
  },
});