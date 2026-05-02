import React from 'react';
import { Bell, Search, User } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between mb-12">
      <div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-1">Painel Financeiro</h2>
        <p className="text-muted font-medium">Bem-vindo de volta, <span className="text-primary font-bold">Lucas Soares</span></p>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Pesquisar transações..." 
            className="pl-12 pr-6 py-3 bg-white border-transparent shadow-sm rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary/30 transition-all w-80 font-medium"
          />
        </div>
        <button className="p-3 text-gray-500 bg-white shadow-sm rounded-2xl hover:bg-gray-50 transition-all relative">
          <Bell size={22} />
          <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-danger border-2 border-white rounded-full" />
        </button>
        <div className="flex items-center gap-4 pl-2 pr-4 py-2 bg-white shadow-sm rounded-2xl cursor-pointer hover:shadow-md transition-all">
          <div className="w-10 h-10 bg-gradient-to-tr from-primary to-accent rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <User size={22} />
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-bold text-gray-900 leading-tight">Lucas Soares</p>
            <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Premium Member</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
