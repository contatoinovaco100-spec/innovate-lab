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
    primary: 'bg-blue-50 text-blue-600',
    success: 'bg-emerald-50 text-emerald-600',
    danger: 'bg-rose-50 text-rose-600',
    accent: 'bg-violet-50 text-violet-600',
  };

  const bgClasses = {
    primary: 'hover:border-blue-200',
    success: 'hover:border-emerald-200',
    danger: 'hover:border-rose-200',
    accent: 'hover:border-violet-200',
  };

  return (
    <div className={`glass-card p-6 transition-all duration-300 border-transparent hover:scale-[1.02] ${bgClasses[color]}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${colorClasses[color]}`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
            {trend}
          </span>
        )}
      </div>
      <h4 className="text-gray-500 text-sm font-medium mb-1">{title}</h4>
      <div className="flex items-baseline gap-1">
        <span className="text-gray-400 text-sm font-medium">R$</span>
        <span className="text-2xl font-bold text-gray-800">
          {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
};

export default SummaryCard;
