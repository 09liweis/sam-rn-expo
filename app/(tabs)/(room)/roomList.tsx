import { Link, router } from "expo-router";
import React, { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  Pressable,
} from "react-native";
import {
  primaryColor,
  secondaryColor,
  tertiaryColor,
} from "src/constant/color";
import useRentStore from "src/stores/rentStore";
import { Room } from "src/types/roomType";
import AddBtn from "components/rental/addBtn";

const RoomList = () => {
  const { fetchRoomList, rentRoomList } = useRentStore();

  useEffect(() => {
    fetchRoomList();
  }, []);

  const renderRoom = ({ item }: any) => (
    <Pressable
      onPress={() => router.push(`(room)/roomForm?roomId=${item._id}`)}
      style={{ flex: 1 }}
    >
      <LinearGradient
        // Background Linear Gradient
        end={{ x: 0.1, y: 0.2 }}
        colors={["#fff", primaryColor]}
        style={styles.card}
      >
        <Text style={styles.roomName}>{item.nm}</Text>
      </LinearGradient>
    </Pressable>
  );

  return (
    <>
      <FlatList
        numColumns={2}
        data={rentRoomList}
        renderItem={renderRoom}
        keyExtractor={(item: Room) => item._id}
        contentContainerStyle={styles.list}
        columnWrapperStyle={{ gap: 20 }}
      />
      <AddBtn href={`(room)/roomForm`} title="Add" />
    </>
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 20,
    gap: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  roomName: {
    color: primaryColor,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
});

export default RoomList;
