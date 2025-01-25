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
import { MotiView } from "moti";
import useTodoStore from "src/stores/todoStore";

const TodoListPage = () => {

  const {showForm, setShowForm} = useTodoStore();

  const [todoList, setTodoList] = useState<any>({});

  return (
    <MotiView 
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'timing', duration: 500 }}
      style={todoStyles.todoPageContainer}
    >
      <TodoLists />

      <MotiView 
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'timing', duration: 500 }}
        style={todoStyles.todoPageContainer}
      >
        <TodoCardList />
      </MotiView>

      <Pressable
        onPress={() => setShowForm(true)}
        style={todoStyles.todoAddBtn}
      >
        <Text style={todoStyles.todoAddBtnText}>+</Text>
      </Pressable>

      {showForm && (
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'timing', scale: { type: 'spring' }}}
          style={todoStyles.todoFormContainer}
        >
          <TodoForm
            todoList={todoList}
          />
        </MotiView>
      )}
    </MotiView>
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
  todoAddBtn: {
    color: "#fff",
    position: "absolute",
    bottom: 10,
    right: 10,
    paddingHorizontal: 20,
    paddingBottom: 17,
    paddingTop: 10,
    borderRadius: 100,
    backgroundColor: "#369eff",
    justifyContent: 'center',
    alignItems: 'center'
  },
  todoAddBtnText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  }
});

export default TodoListPage;
