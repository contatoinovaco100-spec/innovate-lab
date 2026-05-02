import React from 'react';

interface SummaryCardProps {
  title: string;
  amount: number;
  icon: React.ReactNode;
  color: 'primary' | 'success' | 'danger' | 'accent';
  trend?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, icon, color, trend }) => {
  const colorClasses = {
    primary: 'bg-gray-100 text-gray-900',
    success: 'bg-emerald-50 text-emerald-600',
    danger: 'bg-rose-50 text-rose-600',
    accent: 'bg-gray-100 text-gray-900',
  };

  return (
    <div className="glass-card p-6">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${colorClasses[color]}`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {trend}
          </span>
        )}
      </div>
      <h4 className="text-gray-500 text-sm font-medium mb-1">{title}</h4>
      <div className="flex items-baseline gap-1">
        <span className="text-gray-400 text-sm font-medium">R$</span>
        <span className="text-2xl font-bold text-gray-900">
          {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
};

export default SummaryCard;
