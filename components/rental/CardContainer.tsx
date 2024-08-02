import { Link, router } from "expo-router";
import React, { ReactElement, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  StyleSheet,
  Pressable,
} from "react-native";
import {
  primaryColor,
  secondaryColor,
  tertiaryColor,
} from "src/constant/color";

type AddBtnProps = {
  href: string;
  children:ReactElement
}

const CardContainer = ({href,children}:AddBtnProps) => {

  return (
    <Pressable
      onPress={() => router.push(href)}
      style={{ flex: 1 }}
    >
      <LinearGradient
        // Background Linear Gradient
        end={{ x: 0.1, y: 0.2 }}
        colors={["#fff", primaryColor]}
        style={styles.card}
      >
        {children}
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
});

export default CardContainer;
