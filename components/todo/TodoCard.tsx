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
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  todoName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  todoDate: {
    fontSize: 14,
    color: '#666666',
  },
});
