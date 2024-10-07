import { useEffect, useState } from "react";
import { Pressable, TextInput, View, Text, StyleSheet } from "react-native";
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
    const {} = await fetchData({
      url: `${TODO_LIST_API}/${_id || ""}`,
      method,
      body: todoList,
    });
    setTodoList(todoList);
    showToast("Todo List Created");
    fetchTodoLists();
  };

  return (
    <View>
      <TextInput
        value={todoList?.name || ""}
        onChangeText={(text) => setTodoList({ ...todoList, name: text })}
      />
      <Pressable onPress={handleTodoListUpsert}>
        <Text>Add New TodoList</Text>
      </Pressable>
      {todoLists.map((tl) => (
        <Pressable
          onPress={() => {
            setTodoList(tl);
            setCurTodoList(tl);
          }}
          style={todoStyles.todoListItem}
          key={tl._id}
        >
          <Text>{tl.name}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const todoStyles = StyleSheet.create({
  todoListItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
