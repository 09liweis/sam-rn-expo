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
    gap: 10,
  },
  formTitle: {
    fontSize: 24,
  },
  textInput: {
    fontSize: 18,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  formBtn: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  formBtnText: {
    fontSize: 20,
  },
});

export default LoginPage;
