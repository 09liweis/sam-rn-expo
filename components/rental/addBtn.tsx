import { Link, router } from "expo-router";
import React, { useEffect } from "react";
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
  title: string;
}

const AddBtn = ({title,href}:AddBtnProps) => {

  return (
    <Link style={styles.addButton} href={href}>
      {title}
    </Link>
  );
};

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: primaryColor,
    color: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});

export default AddBtn;
