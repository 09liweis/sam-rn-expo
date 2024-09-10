import TodoCard from "components/todo/TodoCard";
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
import { EMPTY_TODO, Loc, Todo } from "src/types/todoType";
import { fetchData, showToast } from "src/utils";

const TodoListPage = () => {
  const [todoLists, setTodoLists] = useState([]);
  const fetchTodolists = async () => {
    const response = await fetchData({ url: TODO_LIST_API });
    setTodoLists(response.todoLists);
  };

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
    fetchTodolists();
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
    const response = await fetchData({url:`${PLACE_SEARCH_API}${location}`});
    const {features} = response;
    if (!features) return;
    const locations:Loc[] = [];
    console.log(features)
    features.map((feature:any)=>{
      const {properties:{coordinates,name}} = feature;
      locations.push({
        addr:name,
        lat:coordinates.latitude,
        lng:coordinates.longitude
      });
    });
    setSearchLocations(locations);
  }

  const handleTodoUpsert = async () => {
    const { _id } = todo;
    const method = _id ? "PUT" : "POST";
    todo.todoList = todoList._id;
    const { todo: newTodo } = await fetchData({
      url: `${TODO_API}/${_id || ""}`,
      method,
      body: todo,
    });
    showToast("Added");
    fetchTodos();
    setShowForm(false);
    setTodo(EMPTY_TODO);
  };

  const handleTodoPress = (todo: any) => {
    setTodo(todo);
    setShowForm(true);
  };

  const [todos, setTodos] = useState([]);
  const fetchTodos = async () => {
    if (!todoList?._id) {
      return;
    }
    const {todos} = await fetchData({ url: `${TODO_LIST_API}/${todoList?._id}` });
    setTodos(todos);
  };
  const renderTodo = ({ item }: any) => {
    return (
      <TodoCard todo={item} handleTodoPress={()=>handleTodoPress(item)} />
    );
  };

  const handleTodoDelete = async (todoId: string) => {
    const response = await fetchData({
      url: `${TODO_API}/${todoId}`,
      method: "DELETE",
    });
    showToast("Deleted");
    fetchTodos();
  };

  useEffect(() => {
    fetchTodolists();
  }, []);

  useEffect(()=>{
    fetchTodos();
  },[todoList._id])

  return (
    <View style={todoStyles.todoPageContainer}>
      <View>
        <TextInput
          value={todoList?.name||""}
          onChangeText={(text) => setTodoList({ ...todoList, name: text })}
        />
        <Pressable onPress={handleTodoListUpsert}>
          <Text>Add TodoList</Text>
        </Pressable>
        {todoLists.map(({ _id, name }) => (
          <Pressable onPress={()=>setTodoList({_id,name})} style={todoStyles.todoListItem} key={_id}>
            <Text>{name}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView>
        <FlatList
          data={todos}
          renderItem={renderTodo}
          contentContainerStyle={todoStyles.todoList}
        />
      </ScrollView>
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
              value={todo.name||""}
              placeholder="name"
              style={todoStyles.todoFormInput}
              onChangeText={(text) => setTodo({ ...todo, name: text })}
            />
            <TextInput
              value={todo.date||""}
              placeholder="date"
              style={todoStyles.todoFormInput}
              onChangeText={(text) => setTodo({ ...todo, date: text })}
            />
            <TextInput placeholder="search location" style={todoStyles.todoFormInput} onChangeText={(text)=>setSearchText(text)} />
            {searchLocations.map((loc)=>
              <Pressable key={loc.addr} onPress={()=>setTodo({...todo,loc})}>
                <Text>{loc.addr}</Text>
              </Pressable>
            )}
            <Pressable
              style={todoStyles.todoFormBtn}
              onPress={handleTodoUpsert}
            >
              <Text>Add</Text>
            </Pressable>
            <Pressable
              style={todoStyles.todoFormBtn}
              onPress={()=>setShowForm(false)}
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
    flexDirection:"row"
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
  todoList: {
    padding: 10,
    flex: 1,
    gap: 10,
  }
});

export default TodoListPage;
