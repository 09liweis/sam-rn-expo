import { TODO_LIST_API } from "src/constant/api";
import { TodoStore,TodoListsResponse, TodoList } from "src/types/todoType";
import { fetchData } from "src/utils";
import { create } from "zustand";

const useTodoStore = create<TodoStore>()((set) => ({
  todoLists:[],
  curTodoList:{name:''},
  setCurTodoList:(todoList:TodoList)=>{
    set({curTodoList:todoList})
  },
  
  fetchTodoLists: async () => {
    const response:TodoListsResponse = await fetchData({ url: TODO_LIST_API });
    set({todoLists:response.todoLists});
  }
}));
export default useTodoStore;
