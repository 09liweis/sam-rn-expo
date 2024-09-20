import TodoCardList from "components/todo/TodoCardList";
import TodoForm from "components/todo/TodoForm";
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
import { PLACE_SEARCH_API, TODO_API, TODO_LIST_API } from "src/constant/api";

import useTodoStore from "src/stores/todoStore";
import { EMPTY_TODO, Loc, Todo } from "src/types/todoType";
import { fetchData, showToast } from "src/utils";

const TodoListPage = () => {
  const {
    fetchTodoLists,
    todoLists,
    setCurTodoList,
    todos,
    fetchTodos,
    upsertTodo,
  } = useTodoStore();

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

  const [showForm, setShowForm] = useState(false);
  const [todo, setTodo] = useState<Todo>(EMPTY_TODO);

  const handleTodoPress = (todo: any) => {
    setTodo(todo);
    setShowForm(true);
  };

  useEffect(() => {
    fetchTodoLists();
  }, []);

  return (
    <View style={todoStyles.todoPageContainer}>
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

      <TodoCardList todos={todos} handleTodoPress={handleTodoPress} />

      <Pressable
        onPress={() => setShowForm(true)}
        style={todoStyles.todoAddBtn}
      >
        <Text>+</Text>
      </Pressable>

      {showForm && (
        <TodoForm
          todo={todo}
          setTodo={setTodo}
          todoList={todoList}
          setShowForm={setShowForm}
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
