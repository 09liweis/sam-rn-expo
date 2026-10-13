import { StatisticsResponse, Todo, UserDetail } from '../types';

const BASE_URL = 'https://samliweisen.onrender.com';
const REQUEST_TIMEOUT_MS = 30000;

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request(
  path: string,
  init: RequestInit,
): Promise<Record<string, unknown>> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...init.headers,
      },
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError('Request timed out. Please try again.');
    }
    throw new ApiError('Network error. Please check your connection.');
  } finally {
    clearTimeout(timer);
  }

  let data: Record<string, unknown> = {};
  try {
    data = (await response.json()) as Record<string, unknown>;
  } catch {
    // non-JSON response
  }

  if (!response.ok) {
    const msg =
      typeof data.msg === 'string' ? data.msg : `Request failed (${response.status})`;
    throw new ApiError(msg, response.status);
  }

  return data;
}

export async function loginRequest(
  email: string,
  password: string,
): Promise<string> {
  const data = await request('/api/user/login', {
    method: 'POST',
    body: JSON.stringify({ eml:email, pwd:password }),
  });

  const token = data.token;
  if (typeof token !== 'string' || !token) {
    throw new ApiError(
      typeof data.msg === 'string' ? data.msg : 'Login failed: no token returned',
    );
  }
  return token;
}

export async function fetchTodosRequest(token: string): Promise<Todo[]> {
  const data = await request('/api/todos', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const todos = data.todos;
  if (!Array.isArray(todos)) {
    throw new ApiError('Invalid response: expected {todos} array');
  }
  return todos as Todo[];
}

function extractTodo(data: Record<string, unknown>): Todo {
  // Accept either {todo: {...}} or a flat todo object
  if (data.todo && typeof data.todo === 'object') {
    return data.todo as unknown as Todo;
  }
  return data as unknown as Todo;
}

export interface TodoInput {
  name: string;
  date: string;
  status: string;
}

export async function createTodoRequest(
  token: string,
  todo: TodoInput,
): Promise<Todo> {
  const data = await request('/api/todos', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(todo),
  });
  return extractTodo(data);
}

export type TodoUpdates = Partial<Pick<Todo, 'name' | 'date' | 'status'>>;

export async function updateTodoRequest(
  token: string,
  id: string,
  updates: TodoUpdates,
): Promise<Todo> {
  const data = await request(`/api/todos/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });
  return extractTodo(data);
}

export async function deleteTodoRequest(
  token: string,
  id: string,
): Promise<void> {
  await request(`/api/todos/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function fetchUserDetailRequest(token: string): Promise<UserDetail> {
  const data = await request('/api/user/detail', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Accept either {user: {...}} or a flat user object
  if (data.user && typeof data.user === 'object') {
    return data.user as UserDetail;
  }
  return data as UserDetail;
}

export async function fetchStatisticsRequest(token: string): Promise<StatisticsResponse> {
  const data = await request('/api/transactions/statistics', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data as unknown as StatisticsResponse;
}
