import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { ActivityIndicator, MD2Colors } from "react-native-paper";

type Movie = {
  title:string
}

export default function MovieDetail() {
  const { title, douban_id } = useLocalSearchParams();
  const [movie, setMovie] = useState<Movie>();
  const [loading, setLoading] = useState(false);

  const fetchDetail = async () => {
    setLoading(true);
    const response = await fetch(
      "https://samliweisen.onrender.com/api/movie/douban/" + douban_id,
      {
        headers: {
          "Content-type": "application/json",
        },
      },
    );
    const json = await response.json();
    setLoading(false);
    setMovie(json);
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  return (
    <View>
      <Stack.Screen
        options={{
          title: title?.toString(),
        }}
      />
      {loading ? (
        <ActivityIndicator animating={true} size={"large"} />
      ) : (
        <View>
          <Text>{movie?.title}</Text>
        </View>
      )}
    </View>
  );
}
