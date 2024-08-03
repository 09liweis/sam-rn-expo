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
import CardContainer from "components/rental/CardContainer";

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
    <CardContainer href={`(room)/renteeForm?renteeId=${item._id}&roomId=${roomId}`}>
      <>
      <Text style={styles.roomName}>{item.nm}</Text>
      <Text>Start Date: {item.startDate}</Text>
      <Text>End Date: {item.endDate}</Text>
      <Text>Deposits: {item.deposits}</Text>
      <Text>Rent: {item.monthlyRent}</Text>
      </>
    </CardContainer>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
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
          contentContainerStyle={{gap:20}}
          keyExtractor={(item) => item._id}
        />
      </ScrollView>
      {roomId && (
        <AddBtn
          href={`(room)/renteeForm?roomId=${roomId}`}
          title="Add new rentee"
        />
      )}
    </View>
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
  }
});

export default RoomRentalForm;
