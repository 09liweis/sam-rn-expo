import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Expense,
  StatisticsResponse,
  Tab,
  Todo,
  User,
  UserDetail,
  generateId,
} from '../types';
import {
  clearToken,
  getStoredToken,
  saveToken,
} from '../storage';
import {
  ApiError,
  createTodoRequest,
  deleteTodoRequest,
  fetchStatisticsRequest,
  fetchTodosRequest,
  fetchUserDetailRequest,
  loginRequest,
  updateTodoRequest,
  TodoUpdates,
} from '../services/api';

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
  addTodo: (name: string, date?: string) => Promise<void>;
  updateTodo: (id: string, updates: TodoUpdates) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  // statistics (server)
  statistics: StatisticsResponse | null;
  statisticsLoading: boolean;
  statisticsError: string | null;
  fetchStatistics: () => Promise<void>;
  // expenses (local)
  expenses: Expense[];
  addExpense: (title: string, amount: number) => void;
  removeExpense: (id: string) => void;
  totalExpense: number;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

function buildUserFromDetail(
  detail: UserDetail,
  token: string,
  fallbackEmail = '',
): User {
  const email =
    (typeof detail.eml === 'string' && detail.eml) || fallbackEmail;
  return {
    email,
    token,
    loginAt: Date.now(),
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('todo');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosLoading, setTodosLoading] = useState(false);
  const [todosError, setTodosError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<StatisticsResponse | null>(null);
  const [statisticsLoading, setStatisticsLoading] = useState(false);
  const [statisticsError, setStatisticsError] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // On app open: if auth_token exists, fetch user detail to refresh state
  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      const token = getStoredToken();
      if (!token) {
        setInitializing(false);
        return;
      }
      try {
        const detail = await fetchUserDetailRequest(token);
        if (cancelled) return;
        setUser(buildUserFromDetail(detail, token));
      } catch {
        if (cancelled) return;
        // Token invalid / expired -> clear and stay logged out
        clearToken();
        setUser(null);
      } finally {
        if (!cancelled) setInitializing(false);
      }
    }

    void restoreSession();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const token = await loginRequest(email, password);
    saveToken(token);
    try {
      const detail = await fetchUserDetailRequest(token);
      setUser(buildUserFromDetail(detail, token, email));
    } catch {
      // If detail fails after a successful login, still keep the user signed in
      // with the credentials we have so they can retry fetching detail later.
      setUser(buildUserFromDetail({}, token, email));
    }
    setActiveTab('todo');
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    setTodos([]);
    setTodosError(null);
    setStatistics(null);
    setStatisticsError(null);
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

  const addTodo = useCallback(
    async (name: string, date?: string) => {
      const currentToken = user?.token;
      if (!currentToken) {
        throw new ApiError('Not logged in');
      }
      const todoDate = date || new Date().toISOString().slice(0, 10);
      const created = await createTodoRequest(currentToken, {
        name,
        date: todoDate,
        status: 'pending',
      });
      setTodos((prev) => [created, ...prev]);
    },
    [user?.token],
  );

  const updateTodo = useCallback(
    async (id: string, updates: TodoUpdates) => {
      const currentToken = user?.token;
      if (!currentToken) {
        throw new ApiError('Not logged in');
      }
      const updated = await updateTodoRequest(currentToken, id, updates);
      setTodos((prev) =>
        prev.map((t) => (t._id === id ? { ...t, ...updated } : t)),
      );
    },
    [user?.token],
  );

  const deleteTodo = useCallback(
    async (id: string) => {
      const currentToken = user?.token;
      if (!currentToken) {
        throw new ApiError('Not logged in');
      }
      await deleteTodoRequest(currentToken, id);
      setTodos((prev) => prev.filter((t) => t._id !== id));
    },
    [user?.token],
  );

  const fetchStatistics = useCallback(async () => {
    setStatisticsLoading(true);
    setStatisticsError(null);
    try {
      const currentToken = user?.token;
      if (!currentToken) {
        throw new ApiError('Not logged in');
      }
      const data = await fetchStatisticsRequest(currentToken);
      setStatistics(data);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Failed to load statistics';
      setStatisticsError(message);
      if (err instanceof ApiError && err.status === 401) {
        logout();
      }
    } finally {
      setStatisticsLoading(false);
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
      addTodo,
      updateTodo,
      deleteTodo,
      statistics,
      statisticsLoading,
      statisticsError,
      fetchStatistics,
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
      addTodo,
      updateTodo,
      deleteTodo,
      statistics,
      statisticsLoading,
      statisticsError,
      fetchStatistics,
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
