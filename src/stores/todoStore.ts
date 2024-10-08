import { TODO_API, TODO_LIST_API } from "src/constant/api";
import {
  TodoStore,
  TodoListsResponse,
  TodoList,
  TodosResponse,
  Todo,
  EMPTY_TODO,
  EMPTY_TODO_LIST,
} from "src/types/todoType";
import { fetchData, showToast } from "src/utils";
import { create } from "zustand";

const useTodoStore = create<TodoStore>()((set, get) => ({
  showForm: false,
  setShowForm: (showForm: boolean) => {
    if (!showForm) {
      set({ curTodo: EMPTY_TODO });
    }
    set({ showForm });
  },

  todoLists: [],
  curTodoList: EMPTY_TODO_LIST,
  curTodo: EMPTY_TODO,
  setCurTodoList: (todoList: TodoList) => {
    set({ curTodoList: todoList });
    get().fetchTodos();
  },

  fetchTodoLists: async () => {
    const response: TodoListsResponse = await fetchData({ url: TODO_LIST_API });
    if (response.todoLists) {
      set({ todoLists: response.todoLists });
    }
  },

  todos: [],
  fetchTodos: async () => {
    const todoListId = get().curTodoList?._id;
    if (!todoListId) return;
    const { todos }: TodosResponse = await fetchData({
      url: `${TODO_LIST_API}/${todoListId}`,
    });
    set({ todos });
  },

  setCurTodo: (todo: Todo) => {
    set({ curTodo: todo });
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

  deleteTodo: async (todoId: string) => {
    const { msg, err } = await fetchData({
      url: `${TODO_API}/${todoId}`,
      method: "DELETE",
    });
    showToast(msg || err);
    if (err) {
      return;
    }
    get().fetchTodos();
  },
}));
export default useTodoStore;
