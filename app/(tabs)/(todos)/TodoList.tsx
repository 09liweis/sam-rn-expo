import TodoCardList from "components/todo/TodoCardList";
import TodoForm from "components/todo/TodoForm";
import TodoLists from "components/todo/TodoLists";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ScrollView,
  TextInput,
} from "react-native";
import useTodoStore from "src/stores/todoStore";

const TodoListPage = () => {

  const {showForm, setShowForm} = useTodoStore();

  const [todoList, setTodoList] = useState<any>({});

  return (
    <View style={todoStyles.todoPageContainer}>

      <TodoLists />

      <TodoCardList />

      <Pressable
        onPress={() => setShowForm(true)}
        style={todoStyles.todoAddBtn}
      >
        <Text>+</Text>
      </Pressable>

      {showForm && (
        <TodoForm
          todoList={todoList}
        />
      )}
    </View>
  );
};

const todoStyles = StyleSheet.create({
  todoPageContainer: {
    position: "relative",
    flex: 1,
    flexDirection: "row",
  },
  todoListItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  todoFormContainer: {
    position: "absolute",
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  todoForm: {
    padding: 10,
    backgroundColor: "#fff",
    width: "60%",
    gap: 10,
  },
  todoFormInput: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
  todoFormBtn: {
    color: "#fff",
    backgroundColor: "#369eff",
    padding: 10,
    textAlign: "center",
    borderRadius: 10,
  },
  todoAddBtn: {
    color: "#fff",
    fontSize: 24,
    position: "absolute",
    bottom: 10,
    right: 10,
    padding: 20,
    borderRadius: 100,
    backgroundColor: "#369eff",
  },
});

export default TodoListPage;
