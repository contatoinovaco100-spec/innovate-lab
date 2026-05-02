import React from 'react';
import { Home, PieChart, CreditCard, Target, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { icon: <Home size={20} />, label: 'Dashboard', active: true },
    { icon: <PieChart size={20} />, label: 'Relatórios' },
    { icon: <CreditCard size={20} />, label: 'Contas' },
    { icon: <Target size={20} />, label: 'Metas' },
    { icon: <Settings size={20} />, label: 'Configurações' },
  ];

  return (
    <aside className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-50 ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="p-6 flex items-center justify-between">
        {isOpen && <h1 className="text-xl font-bold text-primary">Innovate</h1>}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <nav className="mt-6 px-4 space-y-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${
              item.active 
                ? 'bg-blue-50 text-primary font-semibold' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            <span className={item.active ? 'text-primary' : 'text-gray-400'}>{item.icon}</span>
            {isOpen && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="absolute bottom-8 left-0 w-full px-4">
        <button className="w-full flex items-center gap-4 p-3 rounded-xl text-danger hover:bg-red-50 transition-all">
          <LogOut size={20} />
          {isOpen && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
