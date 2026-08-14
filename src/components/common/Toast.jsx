import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const typeConfig = {
    success: {
      bg: 'bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/90 dark:text-emerald-200 dark:border-emerald-800',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
    },
    error: {
      bg: 'bg-rose-50 text-rose-900 border-rose-200 dark:bg-rose-950/90 dark:text-rose-200 dark:border-rose-800',
      icon: <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
    },
    warning: {
      bg: 'bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/90 dark:text-amber-200 dark:border-amber-800',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
    },
    info: {
      bg: 'bg-brand-50 text-brand-900 border-brand-200 dark:bg-brand-950/90 dark:text-brand-200 dark:border-brand-800',
      icon: <Info className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0" />
    }
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 transform translate-y-0 animate-bounce-short ${config.bg}`}>
      {config.icon}
      <p className="text-sm font-medium pr-2">{message}</p>
      {onClose && (
        <button 
          onClick={onClose} 
          className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Toast;
