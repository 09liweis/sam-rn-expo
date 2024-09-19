import { TODO_API, TODO_LIST_API } from "src/constant/api";
import { TodoStore,TodoListsResponse, TodoList, TodosResponse, Todo } from "src/types/todoType";
import { fetchData, showToast } from "src/utils";
import { create } from "zustand";

const useTodoStore = create<TodoStore>()((set,get) => ({
  todoLists:[],
  curTodoList:{name:''},
  setCurTodoList:(todoList:TodoList)=>{
    set({curTodoList:todoList})
    get().fetchTodos();
  },
  
  fetchTodoLists: async () => {
    const response:TodoListsResponse = await fetchData({ url: TODO_LIST_API });
    set({todoLists:response.todoLists});
  },

  todos:[],
  fetchTodos:async()=> {
    const todoListId = get().curTodoList?._id;
    if (!todoListId) return;
    const {todos}:TodosResponse = await fetchData({ url: `${TODO_LIST_API}/${todoListId}` });
    set({todos})
  },

  upsertTodo: async (todo: Todo) => {
    const todoId = todo._id;
    const method = todoId ? "PUT" : "POST";
    return await fetchData({
      url: `${TODO_API}/${todoId || ""}`,
      method,
      body: todo,
    });
  },
  
  deleteTodo:async(todoId:string) => {
    const response = await fetchData({
      url: `${TODO_API}/${todoId}`,
      method: "DELETE",
    });
    showToast("Deleted");
    get().fetchTodos();
  }
}));
export default useTodoStore;
