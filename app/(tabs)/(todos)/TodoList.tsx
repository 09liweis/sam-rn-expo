import TodoCardList from "components/todo/TodoCardList";
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
import useDebounce from "src/hooks/useDebounce";
import useTodoStore from "src/stores/todoStore";
import { EMPTY_TODO, Loc, Todo } from "src/types/todoType";
import { fetchData, showToast } from "src/utils";

const TodoListPage = () => {
  const { fetchTodoLists, todoLists, setCurTodoList, todos, fetchTodos, upsertTodo } =
    useTodoStore();

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
    const { _id } = todo;
    todo.todoList = todoList._id;
    const response = await upsertTodo(todo);
    
    showToast(response.msg);
    fetchTodos();
    setShowForm(false);
    setTodo(EMPTY_TODO);
  };

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
        {todoLists.map(({ _id, name }) => (
          <Pressable
            onPress={() => setCurTodoList({ _id, name })}
            style={todoStyles.todoListItem}
            key={_id}
          >
            <Text>{name}</Text>
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
              <Pressable
                key={loc.addr}
                onPress={() => setTodo({ ...todo, loc })}
              >
                <Text>{loc.addr}</Text>
              </Pressable>
            ))}
            <Pressable
              style={todoStyles.todoFormBtn}
              onPress={handleTodoUpsert}
            >
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
