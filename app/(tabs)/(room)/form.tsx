import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const RoomRentalForm = () => {
  const [roomName, setRoomName] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [depositAmount, setDepositAmount] = useState("");
  const [rentalAmount, setRentalAmount] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || startDate;
    setShowDatePicker(false);
    setStartDate(currentDate);
  };

  const handleSubmit = () => {
    const formData = {
      roomName,
      startDate,
      depositAmount,
      rentalAmount,
    };
    // Handle form submission (e.g., send data to server)
    console.log(formData);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Room Name</Text>
      <TextInput
        style={styles.input}
        value={roomName}
        onChangeText={setRoomName}
      />

      <Text style={styles.label}>Start Date</Text>
      <Button
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
      <Text>{startDate.toDateString()}</Text>

      <Text style={styles.label}>Deposit Amount</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={depositAmount}
        onChangeText={setDepositAmount}
      />

      <Text style={styles.label}>Rental Amount</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={rentalAmount}
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
