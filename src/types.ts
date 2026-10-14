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

export const TODO_TAB:Tab = 'todo';

export interface StatisticsPlace {
  _id: string;
  name: string;
  address?: string;
  icon?: string;
  rating?: number;
  place_id?: string;
  lat?: string | number;
  lng?: string | number;
  types?: string[];
  photos?: string[];
  [key: string]: unknown;
}

export interface StatisticsItem {
  _id: string;
  date: string;
  formatedPrice: string;
  price: number;
  income: boolean;
  category: string;
  title?: string;
  place?: StatisticsPlace;
  [key: string]: unknown;
}

export interface StatisticsCategory {
  category: string;
  percentage: string;
  total: string;
  income: boolean;
  items: StatisticsItem[];
}

export interface StatisticsResponse {
  date: string;
  total: string;
  incomes: string;
  expenses: string;
  categoryPrice: StatisticsCategory[];
}

let counter = 0;

export function generateId(): string {
  counter += 1;
  return `${Date.now().toString(36)}-${counter}`;
}
