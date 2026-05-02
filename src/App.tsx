import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SummaryCard from './components/SummaryCard';
import EvolutionChart from './components/EvolutionChart';
import RecentTransactions from './components/RecentTransactions';
import SavingsGoals from './components/SavingsGoals';
import QuickAdd from './components/QuickAdd';
import { mockTransactions, mockGoals, mockEvolutionData } from './mockData';
import { Plus, Wallet, TrendingUp, TrendingDown, Landmark } from 'lucide-react';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const currentBalance = totalIncome - totalExpense;
  const savings = 1350; // Mocked for now

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'} p-6 md:p-10`}>
        <Header />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <SummaryCard 
            title="Saldo Atual" 
            amount={currentBalance} 
            icon={<Wallet size={24} />} 
            color="primary"
          />
          <SummaryCard 
            title="Entradas do Mês" 
            amount={totalIncome} 
            icon={<TrendingUp size={24} />} 
            color="success"
            trend="+12%"
          />
          <SummaryCard 
            title="Saídas do Mês" 
            amount={totalExpense} 
            icon={<TrendingDown size={24} />} 
            color="danger"
            trend="-5%"
          />
          <SummaryCard 
            title="Quanto Sobrou" 
            amount={currentBalance} 
            icon={<Landmark size={24} />} 
            color="accent"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2 glass-card p-6">
            <h3 className="text-xl mb-6 font-semibold">Evolução Financeira</h3>
            <EvolutionChart data={mockEvolutionData} />
          </div>
          <div className="glass-card p-6">
            <h3 className="text-xl mb-6 font-semibold">Metas de Economia</h3>
            <SavingsGoals goals={mockGoals} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Transações Recentes</h3>
              <button className="text-primary text-sm font-medium hover:underline">Ver todas</button>
            </div>
            <RecentTransactions transactions={transactions} />
          </div>
          <div className="glass-card p-6 h-fit">
            <h3 className="text-xl mb-6 font-semibold">Adição Rápida</h3>
            <QuickAdd />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
