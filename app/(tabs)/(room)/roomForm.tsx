import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Link, router, useLocalSearchParams } from "expo-router";
import { fetchData } from "utils";
import { ROOM_API } from "src/constant/api";

const RoomRentalForm = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [roomName, setRoomName] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (id) {
      fetchData({
        url: `${ROOM_API}/${id}`,
      }).then((response) => {
        setRoomName(response.nm);
      });
    }
  }, []);

  const handleDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || startDate;
    setShowDatePicker(false);
    setStartDate(currentDate);
  };

  const submitRoom = async (roomData: any) => {
    const response = await fetchData({
      url: `${ROOM_API}${id ? "/" + id : ""}`,
      method: id ? "PUT" : "POST",
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
    router.dismiss();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Room Name</Text>
      <TextInput
        style={styles.input}
        value={roomName}
        onChangeText={setRoomName}
      />

      <Button title="Submit" onPress={handleSubmit} />
      <Link href={`(room)/renteeForm?roomId=${id}`}>Add new rentee</Link>
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
  },
});

export default RoomRentalForm;
