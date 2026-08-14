import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Edit3, 
  Trash2, 
  BookOpen, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { parseISO, isBefore, startOfDay } from 'date-fns';

const TaskTable = ({ tasks, onEdit, onDelete, onToggleStatus }) => {
  const today = startOfDay(new Date());

  const priorityConfig = {
    High: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
    Medium: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
    Low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
            <th className="py-3.5 px-4">Status</th>
            <th className="py-3.5 px-4">Title & Description</th>
            <th className="py-3.5 px-4">Subject</th>
            <th className="py-3.5 px-4">Priority</th>
            <th className="py-3.5 px-4">Due Date</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {tasks.map((task) => {
            const isCompleted = task.status === 'Completed';
            const parsedDueDate = task.dueDate ? parseISO(task.dueDate) : null;
            const isOverdue = !isCompleted && parsedDueDate && isBefore(parsedDueDate, today);

            return (
              <tr 
                key={task.id} 
                className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors ${
                  isCompleted ? 'bg-slate-50/40 dark:bg-slate-950/30 opacity-75' : ''
                }`}
              >
                {/* Status Toggle Column */}
                <td className="py-3.5 px-4">
                  <button
                    onClick={() => onToggleStatus(task.id, task.status)}
                    className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300 hover:text-brand-600 transition-colors"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                    <span className={isCompleted ? 'text-emerald-600 dark:text-emerald-400' : ''}>
                      {task.status}
                    </span>
                  </button>
                </td>

                {/* Title & Description Column */}
                <td className="py-3.5 px-4 max-w-xs sm:max-w-sm">
                  <p className={`font-bold text-slate-900 dark:text-white truncate ${isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {task.description}
                    </p>
                  )}
                </td>

                {/* Subject Column */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
                    <BookOpen className="w-3 h-3" />
                    {task.subject || 'General'}
                  </span>
                </td>

                {/* Priority Column */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className={`px-2.5 py-0.5 rounded-full font-semibold ${priorityConfig[task.priority] || priorityConfig.Medium}`}>
                    {task.priority}
                  </span>
                </td>

                {/* Due Date Column */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className={`flex items-center gap-1.5 font-semibold ${
                    isOverdue ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-300'
                  }`}>
                    {isOverdue ? <AlertCircle className="w-3.5 h-3.5" /> : <Calendar className="w-3.5 h-3.5" />}
                    <span>{task.dueDate}</span>
                  </div>
                </td>

                {/* Actions Column */}
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(task)}
                      className="p-1.5 text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(task.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
