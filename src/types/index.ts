export type TransactionCategory =
  | 'alimentação'
  | 'transporte'
  | 'lazer'
  | 'contas fixas'
  | 'saúde'
  | 'compras'
  | 'salário'
  | 'freelance'
  | 'extras';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: TransactionCategory;
  description: string;
  date: string;
}

export type TaskPriority = 'alta' | 'média' | 'baixa';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: TaskPriority;
  category: string;
  date: string;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  color: string;
}

export type ActivePage = 'dashboard' | 'financeiro' | 'agenda' | 'checklist';

export type QuickAddType = 'task' | 'transaction' | 'event' | null;
