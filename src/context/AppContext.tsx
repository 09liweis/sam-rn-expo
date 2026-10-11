import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { Expense, Tab, Todo, User, generateId } from '../types';

interface AppContextValue {
  // auth
  user: User | null;
  login: (username: string) => void;
  logout: () => void;
  // navigation state
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  // todos
  todos: Todo[];
  addTodo: (title: string) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
  // expenses
  expenses: Expense[];
  addExpense: (title: string, amount: number) => void;
  removeExpense: (id: string) => void;
  totalExpense: number;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('todo');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const login = useCallback((username: string) => {
    setUser({ username, loginAt: Date.now() });
    setActiveTab('todo');
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setTodos([]);
    setExpenses([]);
    setActiveTab('todo');
  }, []);

  const addTodo = useCallback((title: string) => {
    setTodos((prev) => [
      { id: generateId(), title, done: false, createdAt: Date.now() },
      ...prev,
    ]);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  }, []);

  const removeTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addExpense = useCallback((title: string, amount: number) => {
    setExpenses((prev) => [
      { id: generateId(), title, amount, createdAt: Date.now() },
      ...prev,
    ]);
  }, []);

  const removeExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const totalExpense = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses],
  );

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      activeTab,
      setActiveTab,
      todos,
      addTodo,
      toggleTodo,
      removeTodo,
      expenses,
      addExpense,
      removeExpense,
      totalExpense,
    }),
    [
      user,
      login,
      logout,
      activeTab,
      todos,
      addTodo,
      toggleTodo,
      removeTodo,
      expenses,
      addExpense,
      removeExpense,
      totalExpense,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
}
