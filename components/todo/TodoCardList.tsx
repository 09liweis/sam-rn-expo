import { FlatList, ScrollView, StyleSheet } from "react-native";
import { Todo } from "src/types/todoType";
import TodoCard from "./TodoCard";


export default function TodoCardList({ todos, handleTodoPress }: { todos: Todo[]; handleTodoPress: (todo: Todo) => void }) {
  
  const renderTodo = ({ item }: any) => {
    return (
      <TodoCard todo={item} handleTodoPress={()=>handleTodoPress(item)} />
    );
  };
  
  return (
    <ScrollView>
      <FlatList
        data={todos}
        renderItem={renderTodo}
        contentContainerStyle={todoStyles.todoList}
      />
    </ScrollView>
  );
}

const todoStyles = StyleSheet.create({
  todoList: {
    padding: 10,
    flex: 1,
    gap: 10,
  }
});