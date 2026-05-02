import React from 'react';
import { Plus, Menu } from 'lucide-react';
import { getGreeting } from '../utils/helpers';
import { QuickAddType } from '../types';

interface TopbarProps {
  onQuickAdd: (type: QuickAddType) => void;
  onMenuToggle: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onQuickAdd, onMenuToggle }) => {
  const today = new Date();
  const dateStr = today.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="topbar">
      <div className="flex-row">
        <button className="btn btn-ghost btn-icon mobile-menu-btn" onClick={onMenuToggle}>
          <Menu size={20} />
        </button>
        <div className="topbar-left">
          <h2>{getGreeting()}, Lucas</h2>
          <p>{dateStr.charAt(0).toUpperCase() + dateStr.slice(1)}</p>
        </div>
      </div>
      <div className="topbar-right">
        <button className="btn btn-secondary btn-sm" onClick={() => onQuickAdd('task')}>
          <Plus size={14} /> Tarefa
        </button>
        <button className="btn btn-secondary btn-sm" onClick={() => onQuickAdd('transaction')}>
          <Plus size={14} /> Gasto
        </button>
        <button className="btn btn-secondary btn-sm" onClick={() => onQuickAdd('event')}>
          <Plus size={14} /> Evento
        </button>
      </div>
    </div>
  );
};

export default Topbar;
