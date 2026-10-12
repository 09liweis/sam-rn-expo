export interface UserDetail {
  _id?: string;
  eml?: string;
  nm?: string;
  [key: string]: unknown;
}

export interface User {
  email: string;
  token: string;
  loginAt: number;
}

export interface Todo {
  _id: string;
  name: string;
  date: string;
  status: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  createdAt: number;
}

export type Tab = 'todo' | 'expense';

export type Statistics = Record<string, unknown>;

let counter = 0;

export function generateId(): string {
  counter += 1;
  return `${Date.now().toString(36)}-${counter}`;
}
