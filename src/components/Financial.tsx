import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, ArrowUpRight, Trash2, Check, RotateCcw, Repeat } from 'lucide-react';
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

type StatusTab = 'pendentes' | 'pagas';

const Financial: React.FC<FinancialProps> = ({ transactions, setTransactions }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<TransactionCategory>('extras');
  const [date, setDate] = useState(getTodayString());
  const [recurring, setRecurring] = useState(false);
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth());
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [statusTab, setStatusTab] = useState<StatusTab>('pendentes');

  // ===== Auto-renew recurring bills every month =====
  useEffect(() => {
    const today = new Date();
    const curMonth = today.getMonth();
    const curYear = today.getFullYear();

    setTransactions((prev: Transaction[]) => {
      // Find all recurringIds
      const groups = new Map<string, Transaction[]>();
      prev.forEach(t => {
        if (t.recurring && t.recurringId) {
          const arr = groups.get(t.recurringId) || [];
          arr.push(t);
          groups.set(t.recurringId, arr);
        }
      });

      const additions: Transaction[] = [];
      groups.forEach((items, rid) => {
        // Sort by date asc to find original
        items.sort((a, b) => a.date.localeCompare(b.date));
        const first = items[0];
        const firstDate = new Date(first.date + 'T00:00:00');
        const day = firstDate.getDate();

        // Generate from first month up to current month
        let y = firstDate.getFullYear();
        let m = firstDate.getMonth();
        while (y < curYear || (y === curYear && m <= curMonth)) {
          const exists = items.some(it => {
            const d = new Date(it.date + 'T00:00:00');
            return d.getMonth() === m && d.getFullYear() === y;
          }) || additions.some(it => {
            if (it.recurringId !== rid) return false;
            const d = new Date(it.date + 'T00:00:00');
            return d.getMonth() === m && d.getFullYear() === y;
          });
          if (!exists) {
            const lastDay = new Date(y, m + 1, 0).getDate();
            const useDay = Math.min(day, lastDay);
            const newDate = `${y}-${String(m + 1).padStart(2, '0')}-${String(useDay).padStart(2, '0')}`;
            additions.push({
              ...first,
              id: generateId(),
              date: newDate,
              status: first.type === 'expense' ? 'pending' : undefined,
              recurringId: rid,
              recurring: true,
            });
          }
          m++;
          if (m > 11) { m = 0; y++; }
        }
      });

      if (additions.length === 0) return prev;
      return [...prev, ...additions];
    });
  }, []); // run on mount

  const filtered = transactions
    .filter(t => {
      const d = new Date(t.date + 'T00:00:00');
      return d.getMonth() === filterMonth && d.getFullYear() === filterYear;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  const income = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const paidExpense = filtered.filter(t => t.type === 'expense' && t.status === 'paid').reduce((s, t) => s + t.amount, 0);
  const pendingExpense = filtered.filter(t => t.type === 'expense' && t.status !== 'paid').reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;

  // Visible list based on tab
  const visible = filtered.filter(t => {
    if (t.type === 'income') return statusTab === 'pagas'; // incomes shown in "pagas"
    return statusTab === 'pendentes' ? t.status !== 'paid' : t.status === 'paid';
  });

  const pendingCount = filtered.filter(t => t.type === 'expense' && t.status !== 'paid').length;
  const paidCount = filtered.filter(t => t.status === 'paid' || t.type === 'income').length;

  const handleAdd = () => {
    if (!desc.trim() || !amount) return;
    const rid = recurring ? generateId() : undefined;
    const newTx: Transaction = {
      id: generateId(),
      type,
      description: desc.trim(),
      amount: parseFloat(amount),
      category,
      date,
      recurring: recurring || undefined,
      recurringId: rid,
      status: type === 'expense' ? 'pending' : undefined,
    };
    setTransactions((prev: Transaction[]) => [...prev, newTx]);
    setDesc(''); setAmount(''); setCategory('extras'); setDate(getTodayString()); setType('expense'); setRecurring(false);
    setModalOpen(false);
  };

  const handleDelete = (t: Transaction) => {
    if (t.recurring && t.recurringId) {
      const ok = window.confirm('Esta é uma fatura recorrente. Deseja excluir TODAS as ocorrências (passadas e futuras)?\n\nOK = Excluir todas\nCancelar = Excluir apenas esta');
      if (ok) {
        setTransactions((prev: Transaction[]) => prev.filter(x => x.recurringId !== t.recurringId));
      } else {
        setTransactions((prev: Transaction[]) => prev.filter(x => x.id !== t.id));
      }
    } else {
      setTransactions((prev: Transaction[]) => prev.filter(x => x.id !== t.id));
    }
  };

  const togglePaid = (id: string) => {
    setTransactions((prev: Transaction[]) =>
      prev.map(t => t.id === id ? { ...t, status: t.status === 'paid' ? 'pending' : 'paid' } : t)
    );
  };

  // Chart data
  const chartData = Array.from({ length: 12 }, (_, i) => {
    const mt = transactions.filter(t => {
      const d = new Date(t.date + 'T00:00:00');
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
          <div className="stat-label">Saídas (pendente / pago)</div>
          <div className="stat-value">{formatCurrency(expense)}</div>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>
            Pendente: {formatCurrency(pendingExpense)} · Pago: {formatCurrency(paidExpense)}
          </div>
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

      {/* Transaction List with Tabs */}
      <div className="card">
        <div className="flex-row gap-8" style={{ marginBottom: 16, borderBottom: '1px solid var(--border)' }}>
          <button
            className="btn btn-ghost"
            onClick={() => setStatusTab('pendentes')}
            style={{
              borderRadius: 0,
              borderBottom: statusTab === 'pendentes' ? '2px solid var(--text)' : '2px solid transparent',
              color: statusTab === 'pendentes' ? 'var(--text)' : 'var(--text-secondary)',
              fontWeight: 600,
            }}
          >
            Pendentes <span className="badge badge-warning" style={{ marginLeft: 6 }}>{pendingCount}</span>
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => setStatusTab('pagas')}
            style={{
              borderRadius: 0,
              borderBottom: statusTab === 'pagas' ? '2px solid var(--text)' : '2px solid transparent',
              color: statusTab === 'pagas' ? 'var(--text)' : 'var(--text-secondary)',
              fontWeight: 600,
            }}
          >
            Pagas <span className="badge badge-success" style={{ marginLeft: 6 }}>{paidCount}</span>
          </button>
        </div>

        {visible.length === 0 ? (
          <div className="empty-state"><p>Nada por aqui neste mês</p></div>
        ) : (
          visible.map(t => (
            <div key={t.id} className="transaction-item">
              <div className="transaction-info">
                <div className={`transaction-icon ${t.type}`}>
                  {t.type === 'income' ? <ArrowUpRight size={16} /> : <TrendingDown size={16} />}
                </div>
                <div>
                  <div className="transaction-desc" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {t.description}
                    {t.recurring && <Repeat size={12} style={{ color: 'var(--text-tertiary)' }} />}
                  </div>
                  <div className="transaction-category">
                    {t.category} · {formatDate(t.date)}
                    {t.recurring && ' · recorrente'}
                  </div>
                </div>
              </div>
              <div className="flex-row gap-12" style={{ alignItems: 'center' }}>
                <div className={`transaction-amount ${t.type === 'income' ? 'positive' : 'negative'}`}>
                  {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                </div>
                {t.type === 'expense' && (
                  <button
                    className="btn btn-ghost btn-icon"
                    onClick={() => togglePaid(t.id)}
                    title={t.status === 'paid' ? 'Marcar como pendente' : 'Marcar como paga'}
                    style={{ color: t.status === 'paid' ? 'var(--success)' : 'var(--text-tertiary)' }}
                  >
                    {t.status === 'paid' ? <RotateCcw size={14} /> : <Check size={14} />}
                  </button>
                )}
                <button className="btn btn-ghost btn-icon" onClick={() => handleDelete(t)} style={{ color: 'var(--text-tertiary)' }}>
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
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, color: 'var(--text)' }}>
            <input type="checkbox" checked={recurring} onChange={e => setRecurring(e.target.checked)} />
            <Repeat size={14} /> Fatura recorrente (renova todo mês automaticamente)
          </label>
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
