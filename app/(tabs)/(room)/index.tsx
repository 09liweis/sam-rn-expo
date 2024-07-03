import { Link, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Button } from "react-native";
import { ROOM_API } from "src/constant/api";
import { fetchData } from "utils";

type Room = {
  _id: string;
  nm: string;
};

const RoomList = () => {
  const [rooms, setRooms] = useState([]);

  const fetchRooms = async () => {
    const response = await fetchData({ url: ROOM_API });
    setRooms(response);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const renderRoom = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.roomName}>{item.nm}</Text>
    </View>
  );

  return (
    <>
      <FlatList
        data={rooms}
        renderItem={renderRoom}
        keyExtractor={(item: Room) => item._id}
        contentContainerStyle={styles.list}
      />
      <Button onPress={() => router.push("(room)/roomForm")} title="Add Room" />
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
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
});

export default RoomList;
