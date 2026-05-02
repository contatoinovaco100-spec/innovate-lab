import { Transaction, Goal } from './types';

export const mockTransactions: Transaction[] = [
  { id: '1', type: 'expense', amount: 120.50, category: 'alimentação', description: 'Restaurante Sabor', date: '2023-10-25' },
  { id: '2', type: 'income', amount: 5000.00, category: 'extras', description: 'Salário Mensal', date: '2023-10-01' },
  { id: '3', type: 'expense', amount: 350.00, category: 'contas fixas', description: 'Energia Elétrica', date: '2023-10-10' },
  { id: '4', type: 'expense', amount: 80.00, category: 'transporte', description: 'Uber', date: '2023-10-22' },
  { id: '5', type: 'expense', amount: 450.00, category: 'lazer', description: 'Cinema e Jantar', date: '2023-10-24' },
];

export const mockGoals: Goal[] = [
  { id: '1', name: 'Viagem de Férias', targetAmount: 5000, currentAmount: 1200, color: '#8b5cf6' },
  { id: '2', name: 'Reserva de Emergência', targetAmount: 10000, currentAmount: 4500, color: '#10b981' },
];

export const mockEvolutionData = [
  { name: 'Jan', income: 4000, expense: 2400 },
  { name: 'Fev', income: 4200, expense: 2800 },
  { name: 'Mar', income: 4100, expense: 2200 },
  { name: 'Abr', income: 4500, expense: 3100 },
  { name: 'Mai', income: 4800, expense: 2900 },
  { name: 'Jun', income: 5000, expense: 3200 },
];
