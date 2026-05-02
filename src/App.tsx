import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SummaryCard from './components/SummaryCard';
import EvolutionChart from './components/EvolutionChart';
import RecentTransactions from './components/RecentTransactions';
import SavingsGoals from './components/SavingsGoals';
import QuickAdd from './components/QuickAdd';
import { mockTransactions, mockGoals, mockEvolutionData } from './mockData';
import { Plus, Wallet, TrendingUp, TrendingDown, Landmark } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

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
      
      <main className={`flex-1 transition-all duration-500 ${isSidebarOpen ? 'ml-64' : 'ml-20'} p-6 md:p-10`}>
        <Header />
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
        >
          <motion.div variants={itemVariants}>
            <SummaryCard 
              title="Saldo Atual" 
              amount={currentBalance} 
              icon={<Wallet size={24} />} 
              color="primary"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <SummaryCard 
              title="Entradas do Mês" 
              amount={totalIncome} 
              icon={<TrendingUp size={24} />} 
              color="success"
              trend="+12%"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <SummaryCard 
              title="Saídas do Mês" 
              amount={totalExpense} 
              icon={<TrendingDown size={24} />} 
              color="danger"
              trend="-5%"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <SummaryCard 
              title="Quanto Sobrou" 
              amount={currentBalance} 
              icon={<Landmark size={24} />} 
              color="accent"
            />
          </motion.div>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10"
        >
          <motion.div variants={itemVariants} className="lg:col-span-2 glass-card p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold">Evolução Financeira</h3>
              <div className="flex gap-4">
                <span className="flex items-center gap-2 text-sm text-muted">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" /> Entradas
                </span>
                <span className="flex items-center gap-2 text-sm text-muted">
                  <span className="w-3 h-3 rounded-full bg-rose-500" /> Saídas
                </span>
              </div>
            </div>
            <EvolutionChart data={mockEvolutionData} />
          </motion.div>
          <motion.div variants={itemVariants} className="glass-card p-8">
            <h3 className="text-2xl mb-8 font-bold">Metas</h3>
            <SavingsGoals goals={mockGoals} />
          </motion.div>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <motion.div variants={itemVariants} className="lg:col-span-2 glass-card p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold">Transações</h3>
              <button className="text-primary font-bold hover:text-primary-hover transition-colors">Ver todas</button>
            </div>
            <RecentTransactions transactions={transactions} />
          </motion.div>
          <motion.div variants={itemVariants} className="glass-card p-8 h-fit">
            <h3 className="text-2xl mb-8 font-bold">Nova Transação</h3>
            <QuickAdd />
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default App;
