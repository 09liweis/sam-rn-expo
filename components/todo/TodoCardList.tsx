import { Animated, FlatList, ScrollView, StyleSheet } from "react-native";
import { Todo } from "src/types/todoType";
import TodoCard from "./TodoCard";
import useTodoStore from "src/stores/todoStore";

export default function TodoCardList() {
  const { todos, setCurTodo, setShowForm } = useTodoStore();

  const renderTodo = ({ item }: any) => {
    return (
      <TodoCard
        todo={item}
        handleTodoPress={() => {
          setCurTodo(item);
          setShowForm(true);
        }}
      />
    );
  };

  return (
    <ScrollView style={todoStyles.container}>
      <Animated.FlatList
        data={todos}
        renderItem={renderTodo}
        contentContainerStyle={todoStyles.todoList}
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      />
    </ScrollView>
  );
}

const todoStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  todoList: {
    paddingVertical: 16,
  },
});
