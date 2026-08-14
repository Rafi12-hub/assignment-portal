import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  User, 
  LogOut, 
  PlusCircle, 
  Calendar,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isMobileOpen, onCloseMobile, onOpenNewTaskModal, taskStats = {} }) => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error("Failed to log out:", err);
    }
  };

  const navItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: LayoutDashboard,
      badge: null
    },
    {
      name: 'All Tasks',
      path: '/tasks',
      icon: CheckSquare,
      badge: taskStats.total || 0
    },
    {
      name: 'My Profile',
      path: '/profile',
      icon: User,
      badge: null
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800/80 
        transform transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col pt-16 md:pt-0
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Brand Header (Desktop) */}
        <div className="hidden md:flex items-center gap-3 p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-brand-400 dark:to-violet-400">
              AcademiaTask
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Student Dashboard</p>
          </div>
        </div>

        {/* Quick Action Button */}
        <div className="p-4">
          <button
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
              if (onOpenNewTaskModal) onOpenNewTaskModal();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Task</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Main Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) => `
                  flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200
                  ${isActive 
                    ? 'bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400 shadow-sm border border-brand-200/50 dark:border-brand-800/50' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge !== null && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Academic Progress Summary Box */}
        <div className="p-4 m-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Tasks Summary</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="block text-xs font-semibold text-amber-600 dark:text-amber-400">
                {taskStats.pending || 0}
              </span>
              <span className="text-[10px] text-slate-400">Pending</span>
            </div>
            <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="block text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {taskStats.completed || 0}
              </span>
              <span className="text-[10px] text-slate-400">Done</span>
            </div>
          </div>
        </div>

        {/* User Footer & Logout */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
