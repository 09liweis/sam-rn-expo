import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import { fetchData } from "src/utils";
import { RENTEE_API } from "src/constant/api";

type RentAmount = {
  date: string;
  amount: string;
};

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
        setEndDate(response.endDate);
        setDepositAmount(response.deposits);
        setRentalAmount(response.monthlyRent);
        setRentAmount(response.monthlyRent);
        setRentAmounts(response.rentAmounts);
      });
    }
  }, []);

  const handleDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || startDate;
    setShowDatePicker(false);
    setStartDate(currentDate);
  };

  const [rentAmounts, setRentAmounts] = useState<RentAmount[]>([]);
  const [rentMonth, setRentMonth] = useState("");
  const [rentAmount, setRentAmount] = useState("");
  const handleAddRentAmounts = () => {
    setRentAmounts([...rentAmounts, { date: rentMonth, amount: rentAmount }]);
    console.log(rentAmounts);
    setRentMonth("");
    setRentAmount("");
  };

  const rentAmountHTML = () => (
    <>
      <Text style={styles.label}>Rent Month & Amounts</Text>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <TextInput
          placeholder="Date"
          style={styles.input}
          value={rentMonth}
          onChangeText={(text) => setRentMonth(text)}
        />
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={rentAmount}
          onChangeText={(text) => setRentAmount(text)}
        />
        <Button title="Add" onPress={handleAddRentAmounts} />
      </View>
      {rentAmounts.map(({date,amount})=>
        <View key={date} style={{flexDirection:"row",gap:10,marginTop:10}}>
          <Text>{date}</Text>
          <Text>{amount}</Text>
        </View>
      )}
    </>
  );

  const submitRentee = async (roomData: any) => {
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
      rentAmounts,
      room: roomId,
    };
    const response = await submitRentee(formData);
    // Handle form submission (e.g., send data to server)
    router.dismiss();
  };

  return (
    <ScrollView style={styles.container}>
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

      {rentAmountHTML()}

      <Button title="Submit" onPress={handleSubmit} />
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
});

export default RoomRentalForm;
