import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import { fetchData } from "utils";
import { RENTEE_API } from "src/constant/api";

const RoomRentalForm = () => {
  const { roomId, renteeId } = useLocalSearchParams<{
    roomId?: string;
    renteeId?: string;
  }>();
  const [roomName, setRoomName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [deposits, setDepositAmount] = useState("");
  const [monthlyRent, setRentalAmount] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (renteeId) {
      fetchData({
        url: `${RENTEE_API}/${renteeId}`,
      }).then((response) => {
        setRoomName(response.nm);
        setStartDate(response.startDate);
        setDepositAmount(response.deposits);
        setRentalAmount(response.monthlyRent);
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
      url: `${RENTEE_API}${renteeId ? "/" + renteeId : ""}`,
      method: renteeId ? "PUT" : "POST",
      body: roomData,
    });
    return response;
  };

  const handleSubmit = async () => {
    const formData = {
      nm: roomName,
      startDate,
      endDate,
      deposits,
      monthlyRent,
      room: roomId,
    };
    const response = await submitRoom(formData);
    // Handle form submission (e.g., send data to server)
    router.dismiss();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Rentee Name</Text>
      <TextInput
        style={styles.input}
        value={roomName}
        onChangeText={setRoomName}
      />

      <Text style={styles.label}>Start Date</Text>
      <TextInput
        style={styles.input}
        value={startDate}
        onChangeText={setStartDate}
      />

      <Text style={styles.label}>End Date</Text>
      <TextInput
        style={styles.input}
        value={endDate}
        onChangeText={setEndDate}
      />
      {/* <Button
        title="Select Start Date"
        onPress={() => setShowDatePicker(true)}
      />
      {showDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      <Text>{startDate.toDateString()}</Text> */}

      <Text style={styles.label}>Deposit Amount</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={deposits}
        onChangeText={setDepositAmount}
      />

      <Text style={styles.label}>Rental Amount</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={monthlyRent}
        onChangeText={setRentalAmount}
      />

      <Button title="Submit" onPress={handleSubmit} />
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
