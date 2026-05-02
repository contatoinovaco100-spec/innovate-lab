import React from 'react';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, Clock, CheckCircle2 } from 'lucide-react';
import { Transaction, Task, CalendarEvent } from '../types';
import { formatCurrency, getTodayString, formatDate } from '../utils/helpers';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

interface DashboardProps {
  transactions: Transaction[];
  tasks: Task[];
  events: CalendarEvent[];
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, tasks, events }) => {
  const today = getTodayString();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const income = monthTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = monthTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;

  const todayTasks = tasks.filter(t => t.date === today);
  const todayTasksDone = todayTasks.filter(t => t.completed).length;

  const upcomingEvents = events
    .filter(e => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
    .slice(0, 5);

  // Build simple chart data from last 6 months
  const chartData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(currentYear, currentMonth - 5 + i, 1);
    const m = d.getMonth();
    const y = d.getFullYear();
    const mt = transactions.filter(t => {
      const td = new Date(t.date);
      return td.getMonth() === m && td.getFullYear() === y;
    });
    const inc = mt.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const exp = mt.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const label = d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
    return { name: label, entradas: inc, saidas: exp, saldo: inc - exp };
  });

  return (
    <div className="animate-in flex-col gap-24">
      {/* Stats Row */}
      <div className="grid-4 mb-24">
        <div className="stat-card">
          <div className="flex-row" style={{ marginBottom: 8 }}>
            <Wallet size={16} style={{ color: 'var(--text-tertiary)' }} />
            <span className="stat-label" style={{ marginBottom: 0 }}>Saldo do Mês</span>
          </div>
          <div className={`stat-value ${balance >= 0 ? 'positive' : 'negative'}`}>
            {formatCurrency(balance)}
          </div>
        </div>
        <div className="stat-card">
          <div className="flex-row" style={{ marginBottom: 8 }}>
            <TrendingUp size={16} style={{ color: 'var(--success)' }} />
            <span className="stat-label" style={{ marginBottom: 0 }}>Entradas</span>
          </div>
          <div className="stat-value positive">{formatCurrency(income)}</div>
        </div>
        <div className="stat-card">
          <div className="flex-row" style={{ marginBottom: 8 }}>
            <TrendingDown size={16} style={{ color: 'var(--danger)' }} />
            <span className="stat-label" style={{ marginBottom: 0 }}>Saídas</span>
          </div>
          <div className="stat-value">{formatCurrency(expense)}</div>
        </div>
        <div className="stat-card">
          <div className="flex-row" style={{ marginBottom: 8 }}>
            <CheckCircle2 size={16} style={{ color: 'var(--success)' }} />
            <span className="stat-label" style={{ marginBottom: 0 }}>Tarefas Hoje</span>
          </div>
          <div className="stat-value">
            {todayTasksDone}<span style={{ fontSize: 14, color: 'var(--text-tertiary)', fontWeight: 400 }}>/{todayTasks.length}</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid-main">
        {/* Left Column */}
        <div className="flex-col gap-24">
          {/* Chart */}
          <div className="card">
            <div className="card-title">Evolução Financeira</div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.1} />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      fontSize: 13,
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Area type="monotone" dataKey="entradas" stroke="#10b981" strokeWidth={2} fill="url(#gIncome)" />
                  <Area type="monotone" dataKey="saidas" stroke="#ef4444" strokeWidth={2} fill="url(#gExpense)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="card">
            <div className="card-title">Últimas Transações</div>
            {monthTransactions.length === 0 ? (
              <div className="empty-state"><p>Nenhuma transação registrada</p></div>
            ) : (
              monthTransactions.slice(-5).reverse().map(t => (
                <div key={t.id} className="transaction-item">
                  <div className="transaction-info">
                    <div className={`transaction-icon ${t.type}`}>
                      {t.type === 'income' ? <ArrowUpRight size={16} /> : <TrendingDown size={16} />}
                    </div>
                    <div>
                      <div className="transaction-desc">{t.description}</div>
                      <div className="transaction-category">{t.category} · {formatDate(t.date)}</div>
                    </div>
                  </div>
                  <div className={`transaction-amount ${t.type === 'income' ? 'positive' : 'negative'}`}>
                    {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-col gap-24">
          {/* Today's Tasks */}
          <div className="card">
            <div className="card-title">Tarefas do Dia</div>
            {todayTasks.length === 0 ? (
              <div className="empty-state"><p>Nenhuma tarefa para hoje</p></div>
            ) : (
              todayTasks.map(task => (
                <div key={task.id} className="task-item">
                  <div className={`task-checkbox ${task.completed ? 'checked' : ''}`}>
                    {task.completed && <CheckCircle2 size={12} />}
                  </div>
                  <div className="flex-1">
                    <div className={`task-text ${task.completed ? 'completed' : ''}`}>{task.title}</div>
                  </div>
                  <div className={`priority-dot priority-${task.priority}`} />
                </div>
              ))
            )}
          </div>

          {/* Upcoming Events */}
          <div className="card">
            <div className="card-title">Próximos Compromissos</div>
            {upcomingEvents.length === 0 ? (
              <div className="empty-state"><p>Nenhum evento agendado</p></div>
            ) : (
              upcomingEvents.map(ev => (
                <div key={ev.id} className="event-item">
                  <div className="event-color" style={{ background: ev.color }} />
                  <div className="flex-1">
                    <div className="event-title">{ev.title}</div>
                    <div className="event-time">
                      <Clock size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                      {formatDate(ev.date)} às {ev.time}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
