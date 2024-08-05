export type ExpensesType = {
  total: string;
  date: string;
  categoryPrice: CategoryItem;
};

export type CategoryItem = {
  category: string;
  total: string;
  percentage: number;
  items: Expense[];
};

export type CategoryItemProps = {
  categoryItem: CategoryItem;
};

export type Expense = {
  id: string;
  price: string;
  date: string;
  category: string;
  place: any;
};
