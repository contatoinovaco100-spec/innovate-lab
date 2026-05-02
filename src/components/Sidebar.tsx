import React from 'react';
import { LayoutDashboard, Wallet, Calendar, CheckSquare, Moon, Sun, LogOut } from 'lucide-react';
import { ActivePage } from '../types';

interface SidebarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activePage, setActivePage, darkMode, toggleDarkMode, isOpen, setIsOpen
}) => {
  const navItems: { id: ActivePage; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'financeiro', label: 'Financeiro', icon: <Wallet size={18} /> },
    { id: 'agenda', label: 'Agenda', icon: <Calendar size={18} /> },
    { id: 'checklist', label: 'Checklist', icon: <CheckSquare size={18} /> },
  ];

  const handleNav = (page: ActivePage) => {
    setActivePage(page);
    setIsOpen(false);
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">C</div>
        <span className="sidebar-logo-text">Command</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`sidebar-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => handleNav(item.id)}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-item" onClick={toggleDarkMode}>
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          {darkMode ? 'Modo claro' : 'Modo escuro'}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
