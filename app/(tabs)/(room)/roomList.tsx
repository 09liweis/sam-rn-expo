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
import CardContainer from "components/rental/CardContainer";
import PageScreenContainer from "components/rental/ScreenContainer";

const RoomList = () => {
  const { fetchRoomList, rentRoomList } = useRentStore();

  useEffect(() => {
    fetchRoomList();
  }, []);

  const renderRoom = ({ item }: any) => (
    <CardContainer href={`(room)/roomForm?roomId=${item._id}`}>
      <Text style={styles.roomName}>{item.nm}</Text>
    </CardContainer>
  );

  return (
    <PageScreenContainer>
      <>
        <FlatList
          numColumns={2}
          data={rentRoomList}
          renderItem={renderRoom}
          keyExtractor={(item: Room) => item._id}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.list}
        />
        <AddBtn href={`(room)/roomForm`} title="Add" />
      </>
    </PageScreenContainer>
  );
};

const styles = StyleSheet.create({
  list: {
    gap: 20,
  },
  roomName: {
    color: primaryColor,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
});

export default RoomList;
