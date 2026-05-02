import React, { useState } from 'react';
import { Plus, CheckCircle2, Trash2, Circle } from 'lucide-react';
import { Task, TaskPriority } from '../types';
import { generateId, getTodayString } from '../utils/helpers';
import Modal from './Modal';

interface ChecklistProps {
  tasks: Task[];
  setTasks: (tasks: Task[] | ((prev: Task[]) => Task[])) => void;
}

const Checklist: React.FC<ChecklistProps> = ({ tasks, setTasks }) => {
  const today = getTodayString();
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('média');
  const [category, setCategory] = useState('geral');
  const [date, setDate] = useState(today);
  const [filter, setFilter] = useState<'all' | 'today' | 'pending' | 'done'>('today');

  const handleAdd = () => {
    if (!title.trim()) return;
    const newTask: Task = {
      id: generateId(),
      title: title.trim(),
      completed: false,
      priority,
      category,
      date,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev: Task[]) => [...prev, newTask]);
    setTitle(''); setPriority('média'); setCategory('geral'); setDate(today);
    setModalOpen(false);
  };

  const toggleTask = (id: string) => {
    setTasks((prev: Task[]) => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks((prev: Task[]) => prev.filter(t => t.id !== id));
  };

  let filtered = tasks;
  if (filter === 'today') filtered = tasks.filter(t => t.date === today);
  else if (filter === 'pending') filtered = tasks.filter(t => !t.completed);
  else if (filter === 'done') filtered = tasks.filter(t => t.completed);

  // Sort: incomplete first, then by priority
  const priorityOrder = { alta: 0, média: 1, baixa: 2 };
  filtered = [...filtered].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const totalToday = tasks.filter(t => t.date === today);
  const doneToday = totalToday.filter(t => t.completed).length;

  return (
    <div className="animate-in flex-col gap-24">
      <div className="flex-row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>Checklist</h2>
          <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
            Hoje: {doneToday}/{totalToday.length} concluídas
          </p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setModalOpen(true)}>
          <Plus size={14} /> Nova Tarefa
        </button>
      </div>

      {/* Filters */}
      <div className="flex-row gap-8">
        {(['today', 'all', 'pending', 'done'] as const).map(f => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(f)}
          >
            {f === 'today' ? 'Hoje' : f === 'all' ? 'Todas' : f === 'pending' ? 'Pendentes' : 'Concluídas'}
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      {filter === 'today' && totalToday.length > 0 && (
        <div className="card" style={{ padding: 16 }}>
          <div className="flex-row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>Progresso do dia</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{Math.round((doneToday / totalToday.length) * 100)}%</span>
          </div>
          <div style={{
            height: 6,
            background: 'var(--bg-input)',
            borderRadius: 8,
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${(doneToday / totalToday.length) * 100}%`,
              background: 'var(--success)',
              borderRadius: 8,
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <Circle size={32} />
            <p>{filter === 'today' ? 'Nenhuma tarefa para hoje' : 'Nenhuma tarefa encontrada'}</p>
          </div>
        ) : (
          filtered.map(task => (
            <div key={task.id} className="task-item">
              <button
                className={`task-checkbox ${task.completed ? 'checked' : ''}`}
                onClick={() => toggleTask(task.id)}
              >
                {task.completed && <CheckCircle2 size={12} />}
              </button>
              <div className="flex-1">
                <div className={`task-text ${task.completed ? 'completed' : ''}`}>{task.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>
                  {task.category} · {task.date === today ? 'Hoje' : new Date(task.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                </div>
              </div>
              <div className="task-meta">
                <div className={`priority-dot priority-${task.priority}`} title={task.priority} />
                <button className="btn btn-ghost btn-icon" onClick={() => deleteTask(task.id)} style={{ color: 'var(--text-tertiary)' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Nova Tarefa">
        <div className="modal-body">
          <div className="input-group">
            <label className="input-label">Título</label>
            <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="O que precisa fazer?" autoFocus />
          </div>
          <div className="grid-2">
            <div className="input-group">
              <label className="input-label">Prioridade</label>
              <select className="input" value={priority} onChange={e => setPriority(e.target.value as TaskPriority)}>
                <option value="alta">Alta</option>
                <option value="média">Média</option>
                <option value="baixa">Baixa</option>
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Data</label>
              <input className="input" type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">Categoria</label>
            <select className="input" value={category} onChange={e => setCategory(e.target.value)}>
              <option value="geral">Geral</option>
              <option value="trabalho">Trabalho</option>
              <option value="pessoal">Pessoal</option>
              <option value="saúde">Saúde</option>
              <option value="estudos">Estudos</option>
              <option value="financeiro">Financeiro</option>
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleAdd}>Criar Tarefa</button>
        </div>
      </Modal>
    </div>
  );
};

export default Checklist;
