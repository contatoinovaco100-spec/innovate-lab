import React from 'react';
import { Home, PieChart, CreditCard, Target, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { icon: <Home size={22} />, label: 'Dashboard', active: true },
    { icon: <PieChart size={22} />, label: 'Relatórios' },
    { icon: <CreditCard size={22} />, label: 'Contas' },
    { icon: <Target size={22} />, label: 'Metas' },
    { icon: <Settings size={22} />, label: 'Ajustes' },
  ];

  return (
    <aside className={`fixed left-0 top-0 h-full bg-white transition-all duration-500 z-50 ${isOpen ? 'w-64' : 'w-20'} shadow-2xl shadow-blue-900/5`}>
      <div className="p-8 flex items-center justify-between">
        {isOpen && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">I</div>
            <h1 className="text-2xl font-black gradient-text">Innovate</h1>
          </div>
        )}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2 rounded-xl bg-gray-50 text-gray-400 hover:bg-primary hover:text-white transition-all duration-300 ${!isOpen && 'mx-auto'}`}
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <nav className="mt-8 px-4 space-y-3">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
              item.active 
                ? 'bg-primary text-white shadow-lg shadow-primary/30 font-bold' 
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            <span className={item.active ? 'text-white' : 'text-gray-400'}>{item.icon}</span>
            {isOpen && <span className="text-sm">{item.label}</span>}
          </button>
        ))}
      </nav>

      {isOpen && (
        <div className="mx-4 mt-10 p-6 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">Plano Atual</p>
            <p className="text-lg font-bold mb-3">Premium PRO</p>
            <button className="w-full py-2 bg-white/20 backdrop-blur-md rounded-xl text-xs font-bold hover:bg-white/30 transition-all">
              Ver Detalhes
            </button>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
        </div>
      )}

      <div className="absolute bottom-10 left-0 w-full px-4">
        <button className="w-full flex items-center gap-4 p-4 rounded-2xl text-gray-400 hover:bg-red-50 hover:text-danger transition-all duration-300">
          <LogOut size={22} />
          {isOpen && <span className="text-sm font-bold">Encerrar Sessão</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
