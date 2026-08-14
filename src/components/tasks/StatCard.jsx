import React from 'react';

const StatCard = ({ title, value, subtext, icon: Icon, color = 'brand', trend }) => {
  const colorVariants = {
    brand: 'from-brand-500/10 to-indigo-500/10 text-brand-600 dark:text-brand-400 border-brand-200/50 dark:border-brand-800/50 icon-bg:bg-brand-500/15',
    amber: 'from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/50 icon-bg:bg-amber-500/15',
    emerald: 'from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50 icon-bg:bg-emerald-500/15',
    rose: 'from-rose-500/10 to-red-500/10 text-rose-600 dark:text-rose-400 border-rose-200/50 dark:border-rose-800/50 icon-bg:bg-rose-500/15',
    violet: 'from-violet-500/10 to-purple-500/10 text-violet-600 dark:text-violet-400 border-violet-200/50 dark:border-violet-800/50 icon-bg:bg-violet-500/15',
  };

  const iconBgVariants = {
    brand: 'bg-brand-100 text-brand-600 dark:bg-brand-950 dark:text-brand-400',
    amber: 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
    emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
    rose: 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400',
    violet: 'bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400',
  };

  const currentVariant = colorVariants[color] || colorVariants.brand;
  const iconBg = iconBgVariants[color] || iconBgVariants.brand;

  return (
    <div className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group`}>
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${currentVariant} rounded-full blur-2xl opacity-60 pointer-events-none`} />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {value}
          </h3>
          {subtext && (
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
              {subtext}
            </p>
          )}
        </div>

        {Icon && (
          <div className={`p-3 rounded-xl ${iconBg} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
