import React from 'react';
import { Transaction } from '../types';
import { Utensils, Car, Coffee, Home, HeartPulse, ShoppingBag, MoreHorizontal, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  const getIcon = (category: string) => {
    switch (category) {
      case 'alimentação': return <Utensils size={18} />;
      case 'transporte': return <Car size={18} />;
      case 'lazer': return <Coffee size={18} />;
      case 'contas fixas': return <Home size={18} />;
      case 'saúde': return <HeartPulse size={18} />;
      case 'compras': return <ShoppingBag size={18} />;
      default: return <MoreHorizontal size={18} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'alimentação': return 'bg-orange-100 text-orange-600';
      case 'transporte': return 'bg-blue-100 text-blue-600';
      case 'lazer': return 'bg-purple-100 text-purple-600';
      case 'contas fixas': return 'bg-emerald-100 text-emerald-600';
      case 'saúde': return 'bg-rose-100 text-rose-600';
      case 'compras': return 'bg-amber-100 text-amber-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-400 text-sm border-b border-gray-100">
            <th className="pb-4 font-medium">Descrição</th>
            <th className="pb-4 font-medium">Categoria</th>
            <th className="pb-4 font-medium">Data</th>
            <th className="pb-4 font-medium text-right">Valor</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {transactions.map((t) => (
            <tr key={t.id} className="group hover:bg-gray-50/50 transition-colors">
              <td className="py-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${getCategoryColor(t.category)}`}>
                    {getIcon(t.category)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{t.description}</p>
                    <div className="flex items-center gap-1 text-xs">
                      {t.type === 'income' ? (
                        <span className="text-emerald-500 flex items-center"><ArrowUpRight size={12} /> Entrada</span>
                      ) : (
                        <span className="text-rose-500 flex items-center"><ArrowDownLeft size={12} /> Saída</span>
                      )}
                    </div>
                  </div>
                </div>
              </td>
              <td className="py-4">
                <span className="text-sm text-gray-500 capitalize">{t.category}</span>
              </td>
              <td className="py-4">
                <span className="text-sm text-gray-500">{new Date(t.date).toLocaleDateString('pt-BR')}</span>
              </td>
              <td className="py-4 text-right">
                <span className={`font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-gray-800'}`}>
                  {t.type === 'income' ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentTransactions;
