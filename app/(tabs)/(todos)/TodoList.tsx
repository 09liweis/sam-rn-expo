import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ScrollView,
} from "react-native";
import { TODO_API } from "src/constant/api";
import { fetchData } from "src/utils";
const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const fetchTodos = async () => {
    const responses = await fetchData({ url: TODO_API });
    setTodos(responses);
  };
  const renderTodo = ({ item }: any) => {
    const { _id, name, date, status } = item;
    return (
      <Pressable
        onLongPress={() => handleTodoDelete(_id)}
        style={todoStyles.todoItem}
        key={_id}
      >
        <Text style={todoStyles.todoName}>{name}</Text>
        <Text style={todoStyles.todoDate}>{date}</Text>
      </Pressable>
    );
  };

  const handleTodoDelete = async (todoId: string) => {
    const response = await fetchData({
      url: `${TODO_API}/${todoId}`,
      method: "DELETE",
    });
    fetchTodos();
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <ScrollView style={todoStyles.todoPageContainer}>
      <FlatList
        data={todos}
        renderItem={renderTodo}
        contentContainerStyle={todoStyles.todoList}
      />
    </ScrollView>
  );
};

const todoStyles = StyleSheet.create({
  todoPageContainer: {
    flex: 1,
  },
  todoList: {
    padding: 10,
    flex: 1,
    gap: 10,
  },
  todoItem: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  todoName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  todoDate: {
    color: "#ccc",
  },
});

export default TodoList;
