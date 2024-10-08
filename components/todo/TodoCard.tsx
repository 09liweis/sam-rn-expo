import { Pressable, StyleSheet, Text } from "react-native";
import useTodoStore from "src/stores/todoStore";
import { Todo } from "src/types/todoType";

interface TodoCardProps {
  todo: Todo;
  handleTodoPress: () => void;
}

export default function TodoCard({ todo, handleTodoPress }: TodoCardProps) {
  const { deleteTodo } = useTodoStore();
  const { _id, name, date, status, todoList, loc } = todo;
  return (
    <Pressable
      onLongPress={() => deleteTodo(_id || "")}
      onPress={handleTodoPress}
      style={todoStyles.todoItem}
      key={_id}
    >
      <Text style={todoStyles.todoName}>{name}</Text>
      <Text style={todoStyles.todoDate}>{date}</Text>
    </Pressable>
  );
}

const todoStyles = StyleSheet.create({
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
