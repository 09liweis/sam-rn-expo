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
import { TODO_API, TODO_LIST_API } from "src/constant/api";
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
  const [todo, setTodo] = useState<any>({});

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
    setTodo({});
  };

  const handleTodoForm = (todo: any) => {
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
    const { _id, name, date, status } = item;
    return (
      <Pressable
        onPress={() => handleTodoForm(item)}
        onLongPress={() => handleTodoDelete(_id)}
        style={todoStyles.todoItem}
        key={_id}
      >
        <Text style={todoStyles.todoName}>{name}</Text>
        <Text style={todoStyles.todoDate}>{date}</Text>
      </Pressable>
    );
  };

  const AssignTodo2TodoList = async (todoListId, todoId) => {
    
  }

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
            {todoLists.map(({ _id, name }) => (
              <Pressable onPress={()=>AssignTodo2TodoList(_id,todo._id)} key={_id}>
                <Text>{name}</Text>
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
  },
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

export default TodoListPage;
