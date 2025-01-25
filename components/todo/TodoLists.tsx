import { useEffect, useState } from "react";
import { Pressable, TextInput, View, Text, StyleSheet, ScrollView } from "react-native";
import { TODO_LIST_API } from "src/constant/api";
import useTodoStore from "src/stores/todoStore";
import { fetchData, showToast } from "src/utils";

export default function TodoLists() {
  const { fetchTodoLists, todoLists, setCurTodoList } = useTodoStore();

  useEffect(() => {
    fetchTodoLists();
  }, []);

  const [todoList, setTodoList] = useState<any>({});

  const handleTodoListUpsert = async () => {
    const { _id } = todoList;
    const method = _id ? "PUT" : "POST";
    await fetchData({
      url: `${TODO_LIST_API}/${_id || ""}`,
      method,
      body: todoList,
    });
    showToast(_id ? "Todo List Updated" : "Todo List Created");
    fetchTodoLists();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={todoList?.name || ""}
        onChangeText={(text) => setTodoList({ ...todoList, name: text })}
        placeholder="Enter new todo list name"
      />
      <Pressable style={styles.button} onPress={handleTodoListUpsert}>
        <Text style={styles.buttonText}>{todoList._id ? "Update" : "Add"} Todo List</Text>
      </Pressable>
      <ScrollView style={styles.listContainer}>
        {todoLists.map((tl) => (
          <Pressable
            key={tl._id}
            onPress={() => {
              setTodoList(tl);
              setCurTodoList(tl);
            }}
            style={[
              styles.todoListItem,
              { backgroundColor: tl._id === todoList._id ? "#e0e0e0" : "#f9f9f9" },
            ]}
          >
            <Text style={styles.todoListItemText}>{tl.name}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#fff",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
  listContainer: {
    // flex: 1,
  },
  todoListItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  todoListItemText: {
    fontSize: 16,
  },
});