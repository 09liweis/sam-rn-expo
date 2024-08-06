import { StatusBar } from "expo-status-bar";
import React, { ReactElement, useEffect } from "react";
import { StyleSheet, View } from "react-native";

type AddBtnProps = {
  children: ReactElement;
};

const PageScreenContainer = ({ children }: AddBtnProps) => {
  return (
    <View style={styles.default}>
      <StatusBar />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  default: {
    flex: 1,
    padding: 20,
  },
});

export default PageScreenContainer;
