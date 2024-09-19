export interface Loc {
  addr: string;
  lat: number;
  lng: number;
}

export interface Todo {
  _id?: string;
  name: string;
  date?: string;
  status?: boolean;
  todoList?: string;
  loc?: Loc;
}

export const EMPTY_TODO = { name: "" };

export interface TodoList {
  _id?: string;
  name: string;
  items?: Todo[];
}

export interface TodoListsResponse {
  todoLists: TodoList[];
}

export interface TodosResponse {
  todos: Todo[];
}

export type TodoStore = {
  todoLists: Array<TodoList>;
  fetchTodoLists: () => void;
  curTodoList?: TodoList;
  setCurTodoList: (todoList: TodoList) => void;
  todos:Todo[],
  fetchTodos: () => void;
  upsertTodo: (todo: Todo) => Promise<Todo>;
};
