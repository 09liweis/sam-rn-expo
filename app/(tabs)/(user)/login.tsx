import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import useUserStore from "src/stores/userStore";
import { showToast } from "src/utils";
import { router } from "expo-router";
import useTodoStore from "src/stores/todoStore";

const LoginPage = () => {
  const { login, curUser } = useUserStore();
  const { fetchTodoLists } = useTodoStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { msg, err } = await login({ eml: email, pwd: password });
    if (err) {
      showToast(err);
    } else {
      showToast(msg);
      fetchTodoLists();
      router.push("/TodoList");
    }
  };

  return (
    <View style={LoginFormStyle.container}>
      <Text style={LoginFormStyle.formTitle}>Welcome to Sam App</Text>
      <TextInput
        style={LoginFormStyle.textInput}
        placeholder="email"
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={LoginFormStyle.textInput}
        placeholder="password"
        onChangeText={(text) => setPassword(text)}
      />
      <Pressable style={LoginFormStyle.formBtn} onPress={handleLogin}>
        <Text style={LoginFormStyle.formBtnText}>Login</Text>
      </Pressable>
    </View>
  );
};

const LoginFormStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
    textAlign: "center",
  },
  textInput: {
    width: "100%",
    height: 50,
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  formBtn: {
    width: "100%",
    height: 50,
    backgroundColor: "#007AFF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  formBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default LoginPage;
