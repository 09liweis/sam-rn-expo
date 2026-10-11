export interface User {
  username: string;
  loginAt: number;
}

export interface Todo {
  id: string;
  title: string;
  done: boolean;
  createdAt: number;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  createdAt: number;
}

export type Tab = 'todo' | 'expense';

let counter = 0;

export function generateId(): string {
  counter += 1;
  return `${Date.now().toString(36)}-${counter}`;
}
