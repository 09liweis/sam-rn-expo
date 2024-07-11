import { Link, router } from "expo-router";
import React, { useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Button } from "react-native";
import {
  primaryColor,
  secondaryColor,
  tertiaryColor,
} from "src/constant/color";
import useRentStore from "src/stores/rentStore";
import { Room } from "src/types/roomType";

const RoomList = () => {
  const { fetchRoomList, rentRoomList } = useRentStore();

  useEffect(() => {
    fetchRoomList();
  }, []);

  const renderRoom = ({ item }: any) => (
    <Link href={`(room)/roomForm?roomId=${item._id}`} style={styles.card}>
      <Text style={styles.roomName}>{item.nm}</Text>
    </Link>
  );

  return (
    <>
      <FlatList
        data={rentRoomList}
        renderItem={renderRoom}
        keyExtractor={(item: Room) => item._id}
        contentContainerStyle={styles.list}
      />
      <Link style={styles.addButton} href={`(room)/roomForm`}>
        Add
      </Link>
    </>
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
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
  addButton: {
    backgroundColor: primaryColor,
    color: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});

export default RoomList;
