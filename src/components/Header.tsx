import React from 'react';
import { Bell, Search, User } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Olá, Lucas! 👋</h2>
        <p className="text-gray-500">Aqui está o resumo das suas finanças hoje.</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Pesquisar..." 
            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-64"
          />
        </div>
        <button className="p-2 text-gray-500 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
          <Bell size={20} />
        </button>
        <div className="flex items-center gap-3 ml-2 p-1 pr-3 bg-white border border-gray-200 rounded-full cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="w-8 h-8 bg-blue-100 text-primary rounded-full flex items-center justify-center">
            <User size={18} />
          </div>
          <span className="text-sm font-semibold text-gray-700">Lucas S.</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
