import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import Financial from './components/Financial';
import Agenda from './components/Agenda';
import Checklist from './components/Checklist';
import Modal from './components/Modal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { ActivePage, QuickAddType, Transaction, Task, CalendarEvent, TransactionCategory, TaskPriority } from './types';
import { generateId, getTodayString } from './utils/helpers';
import { TrendingUp, TrendingDown } from 'lucide-react';

const App: React.FC = () => {
  const [activePage, setActivePage] = useLocalStorage<ActivePage>('activePage', 'dashboard');
  const [darkMode, setDarkMode] = useLocalStorage<boolean>('darkMode', false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', [
    { id: '1', type: 'income', amount: 5000, category: 'salário', description: 'Salário Mensal', date: getTodayString() },
    { id: '2', type: 'expense', amount: 320, category: 'alimentação', description: 'Mercado Semanal', date: getTodayString() },
    { id: '3', type: 'expense', amount: 150, category: 'transporte', description: 'Combustível', date: getTodayString() },
    { id: '4', type: 'expense', amount: 89.90, category: 'saúde', description: 'Farmácia', date: getTodayString() },
  ]);

  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', [
    { id: 't1', title: 'Revisar relatório mensal', completed: false, priority: 'alta', category: 'trabalho', date: getTodayString(), createdAt: new Date().toISOString() },
    { id: 't2', title: 'Ir à academia', completed: true, priority: 'média', category: 'saúde', date: getTodayString(), createdAt: new Date().toISOString() },
    { id: 't3', title: 'Comprar itens do mercado', completed: false, priority: 'baixa', category: 'pessoal', date: getTodayString(), createdAt: new Date().toISOString() },
  ]);

  const [events, setEvents] = useLocalStorage<CalendarEvent[]>('events', [
    { id: 'e1', title: 'Reunião de planejamento', date: getTodayString(), time: '10:00', duration: '1h', color: '#3b82f6' },
    { id: 'e2', title: 'Consulta médica', date: getTodayString(), time: '15:00', duration: '30min', color: '#10b981' },
  ]);

  // Quick add modal state
  const [quickAddType, setQuickAddType] = useState<QuickAddType>(null);
  const [qaTitle, setQaTitle] = useState('');
  const [qaAmount, setQaAmount] = useState('');
  const [qaTxType, setQaTxType] = useState<'income' | 'expense'>('expense');
  const [qaPriority, setQaPriority] = useState<TaskPriority>('média');
  const [qaTime, setQaTime] = useState('09:00');

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleQuickAdd = (type: QuickAddType) => {
    setQuickAddType(type);
    setQaTitle('');
    setQaAmount('');
    setQaTxType('expense');
    setQaPriority('média');
    setQaTime('09:00');
  };

  const handleQuickSave = () => {
    if (!qaTitle.trim()) return;
    const today = getTodayString();

    if (quickAddType === 'task') {
      const newTask: Task = {
        id: generateId(), title: qaTitle.trim(), completed: false, priority: qaPriority,
        category: 'geral', date: today, createdAt: new Date().toISOString(),
      };
      setTasks(prev => [...prev, newTask]);
    } else if (quickAddType === 'transaction') {
      const newTx: Transaction = {
        id: generateId(), type: qaTxType, description: qaTitle.trim(),
        amount: parseFloat(qaAmount) || 0, category: 'extras' as TransactionCategory, date: today,
      };
      setTransactions(prev => [...prev, newTx]);
    } else if (quickAddType === 'event') {
      const newEvt: CalendarEvent = {
        id: generateId(), title: qaTitle.trim(), date: today, time: qaTime,
        duration: '1h', color: '#3b82f6',
      };
      setEvents(prev => [...prev, newEvt]);
    }

    setQuickAddType(null);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard transactions={transactions} tasks={tasks} events={events} />;
      case 'financeiro':
        return <Financial transactions={transactions} setTransactions={setTransactions} />;
      case 'agenda':
        return <Agenda events={events} setEvents={setEvents} tasks={tasks} />;
      case 'checklist':
        return <Checklist tasks={tasks} setTasks={setTasks} />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      <div className="main-content">
        <Topbar onQuickAdd={handleQuickAdd} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="page-content">
          {renderPage()}
        </div>
      </div>

      {/* Quick Add Modal */}
      <Modal
        isOpen={quickAddType !== null}
        onClose={() => setQuickAddType(null)}
        title={
          quickAddType === 'task' ? 'Adicionar Tarefa' :
          quickAddType === 'transaction' ? 'Adicionar Transação' :
          'Adicionar Evento'
        }
      >
        <div className="modal-body">
          <div className="input-group">
            <label className="input-label">
              {quickAddType === 'task' ? 'O que precisa fazer?' : quickAddType === 'transaction' ? 'Descrição' : 'Título do evento'}
            </label>
            <input className="input" value={qaTitle} onChange={e => setQaTitle(e.target.value)} placeholder="Digite aqui..." autoFocus />
          </div>

          {quickAddType === 'transaction' && (
            <>
              <div className="grid-2">
                <button className={`btn ${qaTxType === 'expense' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setQaTxType('expense')} style={{ justifyContent: 'center' }}>
                  <TrendingDown size={14} /> Saída
                </button>
                <button className={`btn ${qaTxType === 'income' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setQaTxType('income')} style={{ justifyContent: 'center' }}>
                  <TrendingUp size={14} /> Entrada
                </button>
              </div>
              <div className="input-group">
                <label className="input-label">Valor (R$)</label>
                <input className="input" type="number" value={qaAmount} onChange={e => setQaAmount(e.target.value)} placeholder="0,00" step="0.01" />
              </div>
            </>
          )}

          {quickAddType === 'task' && (
            <div className="input-group">
              <label className="input-label">Prioridade</label>
              <select className="input" value={qaPriority} onChange={e => setQaPriority(e.target.value as TaskPriority)}>
                <option value="alta">Alta</option>
                <option value="média">Média</option>
                <option value="baixa">Baixa</option>
              </select>
            </div>
          )}

          {quickAddType === 'event' && (
            <div className="input-group">
              <label className="input-label">Horário</label>
              <input className="input" type="time" value={qaTime} onChange={e => setQaTime(e.target.value)} />
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setQuickAddType(null)}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleQuickSave}>Salvar</button>
        </div>
      </Modal>
    </div>
  );
};

export default App;
