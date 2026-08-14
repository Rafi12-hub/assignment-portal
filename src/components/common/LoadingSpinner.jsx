import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'md', label = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 gap-3 text-slate-500 dark:text-slate-400">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-brand-600 dark:text-brand-400`} />
      {label && <p className="text-sm font-medium animate-pulse">{label}</p>}
    </div>
  );
};

export default LoadingSpinner;
