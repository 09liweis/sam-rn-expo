import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const RoomList = () => {
  const rooms = [
    {
      id: "1",
      name: "Room A",
      startDate: "2024-07-02",
      depositAmount: "300",
      rentalAmount: "750",
    },
    {
      id: "2",
      name: "Room B",
      startDate: "2024-07-01",
      depositAmount: "600",
      rentalAmount: "600",
    },
    {
      id: "3",
      name: "Room C",
      startDate: "2024-07-01",
      depositAmount: "750",
      rentalAmount: "750",
    },
    // Add more rooms as needed
  ];

  const renderRoom = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.roomName}>{item.name}</Text>
      <Text>Start Date: {item.startDate}</Text>
      <Text>Deposit Amount: ${item.depositAmount}</Text>
      <Text>Rental Amount: ${item.rentalAmount}</Text>
    </View>
  );

  return (
    <FlatList
      data={rooms}
      renderItem={renderRoom}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
    />
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
