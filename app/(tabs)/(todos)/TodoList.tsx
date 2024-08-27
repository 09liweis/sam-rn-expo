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

  const [showForm, setShowForm] = useState(false);
  const [todo, setTodo] = useState<any>({});
  
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
    <View style={todoStyles.todoPageContainer}>
      <ScrollView >
        <FlatList
          data={todos}
          renderItem={renderTodo}
          contentContainerStyle={todoStyles.todoList}
        />
      </ScrollView>
      <Pressable style={todoStyles.todoAddBtn}>
        <Text>+</Text>
      </Pressable>
    </View>
  );
};

const todoStyles = StyleSheet.create({
  todoPageContainer: {
    position:'relative',
    flex: 1,
  },
  todoAddBtn:{
    position:'absolute',
    bottom:10,
    right:10,
    padding:20,
    borderRadius:100,
    backgroundColor:'#369eff'
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
