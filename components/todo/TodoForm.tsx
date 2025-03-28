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
  todoList: TodoList;
}

export default function TodoForm({ todoList }:TodoFormProps) {
  const {
    curTodo,
    setCurTodo,
    setShowForm,
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
    curTodo.todoList = todoList._id;
    const response = await upsertTodo(curTodo);

    showToast(response.msg);
    fetchTodos();
    setShowForm(false);
    setCurTodo(EMPTY_TODO);
  };

  return (
    <View style={todoStyles.todoFormContainer}>
      <View style={todoStyles.todoForm}>
        <TextInput
          value={curTodo?.name || ""}
          placeholder="name"
          style={todoStyles.todoFormInput}
          onChangeText={(text) => setCurTodo({ ...curTodo, name: text })}
        />
        <TextInput
          value={curTodo?.date || ""}
          placeholder="date"
          style={todoStyles.todoFormInput}
          onChangeText={(text) => setCurTodo({ ...curTodo, date: text })}
        />
        <TextInput
          placeholder="search location"
          style={todoStyles.todoFormInput}
          onChangeText={(text) => setSearchText(text)}
        />
        {searchLocations.map((loc) => (
          <Pressable key={loc.addr} onPress={() => setCurTodo({ ...curTodo, loc })}>
            <Text>{loc.addr}</Text>
          </Pressable>
        ))}
        <Pressable style={todoStyles.todoFormBtn} onPress={handleTodoUpsert}>
          <Text style={todoStyles.todoFormBtnText}>Add</Text>
        </Pressable>
        <Pressable
          style={todoStyles.todoFormBtn}
          onPress={() => setShowForm(false)}
        >
          <Text style={todoStyles.todoFormBtnText}>Cancel</Text>
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
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 10,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  todoFormBtn: {
    backgroundColor: "#369eff",
    padding: 10,
    textAlign: "center",
    borderRadius: 10,
  },
  todoFormBtnText: {
    color: "#fff",
    textAlign: "center",
  }
});
