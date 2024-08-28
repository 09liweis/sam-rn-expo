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
import { TODO_API } from "src/constant/api";
import { fetchData } from "src/utils";
const TodoList = () => {

  const [showForm, setShowForm] = useState(false);
  const [todo, setTodo] = useState<any>({});

  const handleTodoUpsert = async () => {
    const { _id } = todo;
    const method = _id ? "PUT" : "POST";
    const { todo: newTodo } = await fetchData({
      url: `${TODO_API}/${_id||''}`,
      method,
      body: todo,
    });
    fetchTodos();
    setShowForm(false);
  }

  const handleTodoForm = (todo: any) => {
    setTodo(todo);
    setShowForm(true);
  }
  
  const [todos, setTodos] = useState([]);
  const fetchTodos = async () => {
    const responses = await fetchData({ url: TODO_API });
    setTodos(responses);
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

  const handleTodoDelete = async (todoId: string) => {
    const response = await fetchData({
      url: `${TODO_API}/${todoId}`,
      method: "DELETE",
    });
    fetchTodos();
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <View style={todoStyles.todoPageContainer}>
      <ScrollView >
        <FlatList
          data={todos}
          renderItem={renderTodo}
          contentContainerStyle={todoStyles.todoList}
        />
      </ScrollView>
      <Pressable onPress={()=>setShowForm(true)} style={todoStyles.todoAddBtn}>
        +
      </Pressable>

      {showForm &&
        <View style={todoStyles.todoFormContainer}>
          <View style={todoStyles.todoForm}>
            <TextInput value={todo.name} placeholder="name" style={todoStyles.todoFormInput} onChangeText={(text)=>setTodo({...todo,name:text})} />
            <TextInput value={todo.date} placeholder="date" style={todoStyles.todoFormInput} onChangeText={(text)=>setTodo({...todo,date:text})} />
            <Pressable style={todoStyles.todoFormBtn} onPress={handleTodoUpsert}>Add</Pressable>
          </View>
        </View>
      }
      
    </View>
  );
};

const todoStyles = StyleSheet.create({
  todoPageContainer: {
    position:'relative',
    flex: 1,
  },
  todoFormContainer:{
    position:'absolute',
    flex:1,
    backgroundColor:'rgba(0,0,0,0.5)',
    justifyContent:'center',
    alignItems:'center',
    top:0,
    left:0,
    width:'100%',
    height:'100%'
  },
  todoForm:{
    padding:10,
    backgroundColor:'#fff',
    width:'60%',
    gap:10
  },
  todoFormInput:{
    padding:10,
    borderWidth:1,
    borderRadius:10
  },
  todoFormBtn:{
    color:'#fff',
    backgroundColor:'#369eff',
    padding:10,
    textAlign:'center',
    borderRadius:10
  },
  todoAddBtn:{
    color:'#fff',
    fontSize:24,
    position:'absolute',
    bottom:10,
    right:10,
    padding:20,
    borderRadius:100,
    backgroundColor:'#369eff'
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

export default TodoList;
