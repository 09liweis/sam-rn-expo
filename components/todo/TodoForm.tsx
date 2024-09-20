import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ScrollView,
  TextInput,
} from "react-native";
import { useEffect, useState } from "react";
import { PLACE_SEARCH_API, TODO_API, TODO_LIST_API } from "src/constant/api";
import { EMPTY_TODO, Loc, Todo, TodoList } from "src/types/todoType";
import useDebounce from "src/hooks/useDebounce";
import { fetchData, showToast } from "src/utils";
import useTodoStore from "src/stores/todoStore";

interface TodoFormProps {
  todo: Todo;
  todoList: TodoList;
  setTodo: (todo: Todo) => void;
  setShowForm: (showForm: boolean) => void;
}

export default function TodoForm({ todo, setTodo, todoList, setShowForm }:TodoFormProps) {
  const {
    fetchTodoLists,
    todoLists,
    setCurTodoList,
    todos,
    fetchTodos,
    upsertTodo,
  } = useTodoStore();

  const [searchText, setSearchText] = useState("");
  const [searchLocations, setSearchLocations] = useState<Loc[]>([]);
  const debounce = useDebounce(searchText, 1000);

  useEffect(() => {
    searchLocation(searchText);
  }, [debounce]);

  const searchLocation = async (location: string) => {
    if (!location) return;
    const response = await fetchData({ url: `${PLACE_SEARCH_API}${location}` });
    const { features } = response;
    if (!features) return;
    const locations: Loc[] = [];
    console.log(features);
    features.map((feature: any) => {
      const {
        properties: { coordinates, name },
      } = feature;
      locations.push({
        addr: name,
        lat: coordinates.latitude,
        lng: coordinates.longitude,
      });
    });
    setSearchLocations(locations);
  };

  const handleTodoUpsert = async () => {
    todo.todoList = todoList._id;
    const response = await upsertTodo(todo);

    showToast(response.msg);
    fetchTodos();
    setShowForm(false);
    setTodo(EMPTY_TODO);
  };

  return (
    <View style={todoStyles.todoFormContainer}>
      <View style={todoStyles.todoForm}>
        <TextInput
          value={todo.name || ""}
          placeholder="name"
          style={todoStyles.todoFormInput}
          onChangeText={(text) => setTodo({ ...todo, name: text })}
        />
        <TextInput
          value={todo.date || ""}
          placeholder="date"
          style={todoStyles.todoFormInput}
          onChangeText={(text) => setTodo({ ...todo, date: text })}
        />
        <TextInput
          placeholder="search location"
          style={todoStyles.todoFormInput}
          onChangeText={(text) => setSearchText(text)}
        />
        {searchLocations.map((loc) => (
          <Pressable key={loc.addr} onPress={() => setTodo({ ...todo, loc })}>
            <Text>{loc.addr}</Text>
          </Pressable>
        ))}
        <Pressable style={todoStyles.todoFormBtn} onPress={handleTodoUpsert}>
          <Text>Add</Text>
        </Pressable>
        <Pressable
          style={todoStyles.todoFormBtn}
          onPress={() => setShowForm(false)}
        >
          <Text>Cancel</Text>
        </Pressable>
      </View>
    </View>
  );
}

const todoStyles = StyleSheet.create({
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
});
