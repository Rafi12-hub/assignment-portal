import React from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Edit3, 
  Trash2, 
  AlertCircle,
  BookOpen
} from 'lucide-react';
import { formatDistanceToNow, isAfter, isBefore, startOfDay, parseISO } from 'date-fns';

const TaskCard = ({ task, onEdit, onDelete, onToggleStatus }) => {
  const { id, title, description, subject, dueDate, priority, status } = task;

  // Format priority styling
  const priorityConfig = {
    High: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    Low: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  };

  // Due date calculations
  const parsedDueDate = dueDate ? parseISO(dueDate) : new Date();
  const today = startOfDay(new Date());
  const isOverdue = status !== 'Completed' && isBefore(parsedDueDate, today);
  const isDueToday = status !== 'Completed' && (parsedDueDate.toDateString() === today.toDateString());

  const getDueDateLabel = () => {
    if (!dueDate) return 'No due date';
    if (isOverdue) return `Overdue (${dueDate})`;
    if (isDueToday) return 'Due Today!';
    try {
      return `Due ${formatDistanceToNow(parsedDueDate, { addSuffix: true })}`;
    } catch (e) {
      return dueDate;
    }
  };

  const isCompleted = status === 'Completed';

  return (
    <div className={`
      relative flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border 
      transition-all duration-300 hover:shadow-lg group
      ${isCompleted 
        ? 'border-slate-200 dark:border-slate-800 opacity-80 bg-slate-50/50 dark:bg-slate-950/50' 
        : isOverdue
        ? 'border-rose-300 dark:border-rose-800/80 shadow-rose-500/5'
        : 'border-slate-200/80 dark:border-slate-800/80 shadow-sm'
      }
    `}>
      {/* Top Header: Subject & Priority Badges */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/60">
            <BookOpen className="w-3 h-3" />
            {subject || 'General'}
          </span>

          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${priorityConfig[priority] || priorityConfig.Medium}`}>
              {priority}
            </span>

            {/* Quick Status Toggle Button */}
            <button
              onClick={() => onToggleStatus(id, status)}
              className={`p-1 rounded-lg transition-colors ${
                isCompleted 
                  ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50' 
                  : 'text-slate-400 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
            >
              {isCompleted ? <CheckCircle2 className="w-5 h-5 fill-emerald-100 dark:fill-emerald-950" /> : <Circle className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Task Title & Strikethrough if completed */}
        <h4 className={`text-base font-bold text-slate-900 dark:text-white leading-snug ${isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
          {title}
        </h4>

        {/* Description */}
        {description && (
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Footer: Due Date Badge & Action Buttons */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        {/* Due Date Indicator */}
        <div className={`flex items-center gap-1.5 text-xs font-semibold ${
          isCompleted 
            ? 'text-slate-400' 
            : isOverdue 
            ? 'text-rose-600 dark:text-rose-400' 
            : isDueToday 
            ? 'text-amber-600 dark:text-amber-400' 
            : 'text-slate-500 dark:text-slate-400'
        }`}>
          {isOverdue ? <AlertCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
          <span>{getDueDateLabel()}</span>
        </div>

        {/* Edit & Delete Action Buttons */}
        <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Edit task"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(id)}
            className="p-1.5 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
