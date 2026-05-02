import React, { useState } from 'react';
import { PlusCircle, MinusCircle } from 'lucide-react';

const QuickAdd: React.FC = () => {
  const [type, setType] = useState<'income' | 'expense'>('expense');

  return (
    <div className="space-y-4">
      <div className="flex p-1 bg-gray-100 rounded-xl">
        <button 
          onClick={() => setType('income')}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
            type === 'income' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Receita
        </button>
        <button 
          onClick={() => setType('expense')}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
            type === 'expense' ? 'bg-white text-rose-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Despesa
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">Descrição</label>
          <input 
            type="text" 
            placeholder="Ex: Almoço, Salário..." 
            className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-primary/30 focus:outline-none transition-all"
          />
        </div>
        
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">Valor (R$)</label>
          <input 
            type="number" 
            placeholder="0,00" 
            className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-primary/30 focus:outline-none transition-all font-bold text-lg"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">Categoria</label>
          <select className="w-full mt-1 px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-primary/30 focus:outline-none transition-all">
            <option>Alimentação</option>
            <option>Transporte</option>
            <option>Lazer</option>
            <option>Contas Fixas</option>
            <option>Saúde</option>
            <option>Compras</option>
            <option>Extras</option>
          </select>
        </div>

        <button className={`w-full py-3 mt-2 rounded-xl text-white font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${
          type === 'income' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200' : 'bg-rose-500 hover:bg-rose-600 shadow-rose-200'
        }`}>
          {type === 'income' ? <PlusCircle size={20} /> : <MinusCircle size={20} />}
          Adicionar {type === 'income' ? 'Receita' : 'Despesa'}
        </button>
      </div>
    </div>
  );
};

export default QuickAdd;
