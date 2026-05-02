export type Category = 'alimentação' | 'transporte' | 'lazer' | 'contas fixas' | 'saúde' | 'compras' | 'extras';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: Category;
  description: string;
  date: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  color: string;
}
