import React, { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, ArrowUpRight, Trash2 } from 'lucide-react';
import { Transaction, TransactionCategory } from '../types';
import { formatCurrency, formatDate, generateId, getTodayString } from '../utils/helpers';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Modal from './Modal';

interface FinancialProps {
  transactions: Transaction[];
  setTransactions: (txns: Transaction[] | ((prev: Transaction[]) => Transaction[])) => void;
}

const categories: TransactionCategory[] = [
  'alimentação', 'transporte', 'lazer', 'contas fixas', 'saúde', 'compras', 'salário', 'freelance', 'extras'
];

const Financial: React.FC<FinancialProps> = ({ transactions, setTransactions }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<TransactionCategory>('extras');
  const [date, setDate] = useState(getTodayString());
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth());
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());

  const filtered = transactions
    .filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === filterMonth && d.getFullYear() === filterYear;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  const income = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;

  const handleAdd = () => {
    if (!desc.trim() || !amount) return;
    const newTx: Transaction = {
      id: generateId(),
      type,
      description: desc.trim(),
      amount: parseFloat(amount),
      category,
      date,
    };
    setTransactions((prev: Transaction[]) => [...prev, newTx]);
    setDesc(''); setAmount(''); setCategory('extras'); setDate(getTodayString()); setType('expense');
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setTransactions((prev: Transaction[]) => prev.filter(t => t.id !== id));
  };

  // Chart data
  const chartData = Array.from({ length: 12 }, (_, i) => {
    const mt = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === i && d.getFullYear() === filterYear;
    });
    const inc = mt.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const exp = mt.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const label = new Date(filterYear, i, 1).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
    return { name: label, entradas: inc, saidas: exp };
  });

  const monthLabel = new Date(filterYear, filterMonth, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div className="animate-in flex-col gap-24">
      {/* Summary */}
      <div className="flex-row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600 }}>
          Financeiro — <span style={{ textTransform: 'capitalize' }}>{monthLabel}</span>
        </h2>
        <div className="flex-row gap-8">
          <button className="btn btn-secondary btn-sm" onClick={() => {
            const prev = filterMonth === 0 ? 11 : filterMonth - 1;
            const yr = filterMonth === 0 ? filterYear - 1 : filterYear;
            setFilterMonth(prev); setFilterYear(yr);
          }}>← Anterior</button>
          <button className="btn btn-secondary btn-sm" onClick={() => {
            const next = filterMonth === 11 ? 0 : filterMonth + 1;
            const yr = filterMonth === 11 ? filterYear + 1 : filterYear;
            setFilterMonth(next); setFilterYear(yr);
          }}>Próximo →</button>
          <button className="btn btn-primary btn-sm" onClick={() => setModalOpen(true)}>
            <Plus size={14} /> Novo Registro
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-3">
        <div className="stat-card">
          <div className="stat-label">Entradas</div>
          <div className="stat-value positive">{formatCurrency(income)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Saídas</div>
          <div className="stat-value">{formatCurrency(expense)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Saldo</div>
          <div className={`stat-value ${balance >= 0 ? 'positive' : 'negative'}`}>
            {formatCurrency(balance)}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="card">
        <div className="card-title">Visão Anual — {filterYear}</div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
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
              <Bar dataKey="entradas" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="saidas" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transaction List */}
      <div className="card">
        <div className="card-title">
          Transações
          <span className="badge badge-info">{filtered.length}</span>
        </div>
        {filtered.length === 0 ? (
          <div className="empty-state"><p>Sem transações neste mês</p></div>
        ) : (
          filtered.map(t => (
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
              <div className="flex-row gap-12">
                <div className={`transaction-amount ${t.type === 'income' ? 'positive' : 'negative'}`}>
                  {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                </div>
                <button className="btn btn-ghost btn-icon" onClick={() => handleDelete(t.id)} style={{ color: 'var(--text-tertiary)' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Nova Transação">
        <div className="modal-body">
          <div className="grid-2">
            <button
              className={`btn ${type === 'income' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setType('income')}
              style={{ justifyContent: 'center' }}
            >
              <TrendingUp size={14} /> Entrada
            </button>
            <button
              className={`btn ${type === 'expense' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setType('expense')}
              style={{ justifyContent: 'center' }}
            >
              <TrendingDown size={14} /> Saída
            </button>
          </div>
          <div className="input-group">
            <label className="input-label">Descrição</label>
            <input className="input" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Ex: Mercado, Salário..." />
          </div>
          <div className="input-group">
            <label className="input-label">Valor (R$)</label>
            <input className="input" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0,00" step="0.01" />
          </div>
          <div className="grid-2">
            <div className="input-group">
              <label className="input-label">Categoria</label>
              <select className="input" value={category} onChange={e => setCategory(e.target.value as TransactionCategory)}>
                {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Data</label>
              <input className="input" type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleAdd}>Salvar</button>
        </div>
      </Modal>
    </div>
  );
};

export default Financial;
