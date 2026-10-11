import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Expense, Tab, Todo, User, generateId } from '../types';
import {
  clearSession,
  getStoredSession,
  saveSession,
} from '../storage';
import { ApiError, fetchTodosRequest, loginRequest } from '../services/api';

interface AppContextValue {
  // auth
  initializing: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  // navigation state
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  // todos (server)
  todos: Todo[];
  todosLoading: boolean;
  todosError: string | null;
  fetchTodos: () => Promise<void>;
  // expenses (local)
  expenses: Expense[];
  addExpense: (title: string, amount: number) => void;
  removeExpense: (id: string) => void;
  totalExpense: number;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('todo');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosLoading, setTodosLoading] = useState(false);
  const [todosError, setTodosError] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Restore session from localStorage on startup
  useEffect(() => {
    const stored = getStoredSession();
    if (stored) {
      setUser({
        email: stored.email,
        token: stored.token,
        loginAt: Date.now(),
      });
    }
    setInitializing(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const token = await loginRequest(email, password);
    saveSession(token, email);
    setUser({ email, token, loginAt: Date.now() });
    setActiveTab('todo');
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    setTodos([]);
    setTodosError(null);
    setExpenses([]);
    setActiveTab('todo');
  }, []);

  const fetchTodos = useCallback(async () => {
    setTodosLoading(true);
    setTodosError(null);
    try {
      const currentToken = user?.token;
      if (!currentToken) {
        throw new ApiError('Not logged in');
      }
      const list = await fetchTodosRequest(currentToken);
      setTodos(list);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Failed to load todos';
      setTodosError(message);
      // Token expired / revoked -> force logout
      if (err instanceof ApiError && err.status === 401) {
        logout();
      }
    } finally {
      setTodosLoading(false);
    }
  }, [user?.token, logout]);

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
      initializing,
      user,
      login,
      logout,
      activeTab,
      setActiveTab,
      todos,
      todosLoading,
      todosError,
      fetchTodos,
      expenses,
      addExpense,
      removeExpense,
      totalExpense,
    }),
    [
      initializing,
      user,
      login,
      logout,
      activeTab,
      todos,
      todosLoading,
      todosError,
      fetchTodos,
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
