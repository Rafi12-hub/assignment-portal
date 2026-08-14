import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Sun, 
  Moon, 
  GraduationCap, 
  User, 
  LogOut, 
  Sparkles, 
  Info,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ onMobileMenuToggle, onOpenNewTaskModal }) => {
  const { currentUser, logout, isDemoMode } = useAuth();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const getInitials = (name) => {
    if (!name) return 'ST';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 py-3 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left Section: Mobile Menu Button & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden transition-colors"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-brand-400 dark:to-violet-400">
                AcademiaTask
              </span>
              <span className="text-xs block font-medium text-slate-400 -mt-1">Assignment Portal</span>
            </div>
          </div>
        </div>

        {/* Middle Section: Demo Mode Indicator */}
        {isDemoMode && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Demo Mode (Local State)</span>
            <div className="group relative cursor-pointer">
              <Info className="w-3.5 h-3.5 opacity-75 hover:opacity-100" />
              <div className="absolute top-full right-0 mt-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-xl shadow-xl hidden group-hover:block z-50">
                Add your Firebase API keys to <code>.env.local</code> to connect live Firebase Authentication and Cloud Firestore!
              </div>
            </div>
          </div>
        )}

        {/* Right Section: Theme Toggle, Quick Action & User Profile */}
        <div className="flex items-center gap-2.5">
          {/* Quick Create Task Trigger */}
          {onOpenNewTaskModal && (
            <button
              onClick={onOpenNewTaskModal}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>+ Add Task</span>
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {getInitials(currentUser?.displayName)}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                  {currentUser?.displayName || 'Student'}
                </p>
                <p className="text-[10px] text-slate-400 truncate max-w-[120px]">
                  {currentUser?.email}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 hidden lg:block" />
            </button>

            {/* Dropdown Menu */}
            {userDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setUserDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-800 dark:text-white">
                      {currentUser?.displayName || 'Student'}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {currentUser?.email}
                    </p>
                    {currentUser?.studentId && (
                      <span className="mt-1 inline-block px-2 py-0.5 bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 rounded text-[10px] font-semibold">
                        ID: {currentUser.studentId}
                      </span>
                    )}
                  </div>

                  <div className="py-1">
                    <div className="px-4 py-1.5 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                      Academic Profile
                    </div>
                    <div className="px-4 py-1 text-xs text-slate-600 dark:text-slate-300">
                      Major: <span className="font-medium text-slate-900 dark:text-white">{currentUser?.major || 'Computer Science'}</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-1 mt-1">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
