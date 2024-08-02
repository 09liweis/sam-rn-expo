import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Link, router, useLocalSearchParams } from "expo-router";
import { fetchData } from "src/utils";
import { ROOM_API } from "src/constant/api";
import useRentStore from "src/stores/rentStore";
import AddBtn from "components/rental/addBtn";

const RoomRentalForm = () => {
  const { fetchRoomList, fetchRoomDetail } = useRentStore();
  const { roomId } = useLocalSearchParams<{ roomId?: string }>();
  const [roomName, setRoomName] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [rentees, setRentees] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fetchRoom = async (roomId: string) => {
    const curRoom = await fetchRoomDetail(roomId);
    setRoomName(curRoom.nm);
    setRentees(curRoom.rentees);
  };

  useEffect(() => {
    if (roomId) {
      fetchRoom(roomId);
    }
  }, []);

  const handleDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || startDate;
    setShowDatePicker(false);
    setStartDate(currentDate);
  };

  const submitRoom = async (roomData: any) => {
    const response = await fetchData({
      url: `${ROOM_API}${roomId ? "/" + roomId : ""}`,
      method: roomId ? "PUT" : "POST",
      body: roomData,
    });
    return response;
  };

  const handleSubmit = async () => {
    const formData = {
      nm: roomName,
    };
    const response = await submitRoom(formData);
    // Handle form submission (e.g., send data to server)
    fetchRoomList();
    router.dismiss();
  };

  const renderRentee = ({ item }: any) => (
    <Link href={`(room)/renteeForm?renteeId=${item._id}&roomId=${roomId}`}>
      <View style={styles.card}>
        <Text style={styles.roomName}>{item.nm}</Text>
        <Text>Start Date: {item.startDate}</Text>
        <Text>End Date: {item.endDate}</Text>
        <Text>Deposits: {item.deposits}</Text>
        <Text>Rent: {item.monthlyRent}</Text>
      </View>
    </Link>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Room Name</Text>
      <TextInput
        style={styles.input}
        value={roomName}
        onChangeText={setRoomName}
      />

      <Button title="Submit" onPress={handleSubmit} />
      <FlatList
        data={rentees}
        renderItem={renderRentee}
        keyExtractor={(item) => item._id}
      />
      <AddBtn
        href={`(room)/renteeForm?roomId=${roomId}`}
        title="Add new rentee"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 16,
    borderRadius: 4,
  },

  list: {
    padding: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: "column",
  },
  roomName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
});

export default RoomRentalForm;
