import React from 'react';
import { Bell, Search, User } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between mb-12">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">Dashboard</h2>
        <p className="text-muted">Bem-vindo de volta, <span className="font-semibold text-gray-900">Lucas Soares</span></p>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Pesquisar..." 
            className="pl-12 pr-6 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all w-64"
          />
        </div>
        <button className="p-2.5 text-gray-500 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-all relative">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-danger rounded-full" />
        </button>
        <div className="flex items-center gap-3 pl-2 pr-4 py-1.5 bg-white border border-gray-200 rounded-full cursor-pointer hover:bg-gray-50 transition-all">
          <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white">
            <User size={16} />
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-gray-900 leading-tight">Lucas Soares</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
