import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, CheckSquare, SearchX } from 'lucide-react';
import TaskFilterBar from '../components/tasks/TaskFilterBar';
import TaskCard from '../components/tasks/TaskCard';
import TaskTable from '../components/tasks/TaskTable';
import LoadingSpinner from '../components/common/LoadingSpinner';

const TasksPage = () => {
  const { 
    tasks, 
    loadingTasks, 
    onOpenNewTaskModal, 
    onEditTask, 
    onDeleteTask, 
    onToggleStatus 
  } = useOutletContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('dueDate');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Extract unique available subjects from tasks
  const availableSubjects = useMemo(() => {
    const subs = new Set();
    tasks.forEach(t => {
      if (t.subject) subs.add(t.subject);
    });
    return Array.from(subs);
  }, [tasks]);

  // Filter & Sort Logic
  const filteredAndSortedTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Status filter
        if (statusFilter !== 'All' && task.status !== statusFilter) return false;
        
        // Subject filter
        if (subjectFilter !== 'All' && task.subject !== subjectFilter) return false;
        
        // Priority filter
        if (priorityFilter !== 'All' && task.priority !== priorityFilter) return false;

        // Search term filter
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const matchTitle = task.title?.toLowerCase().includes(term);
          const matchSubject = task.subject?.toLowerCase().includes(term);
          const matchDesc = task.description?.toLowerCase().includes(term);
          if (!matchTitle && !matchSubject && !matchDesc) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'dueDate') {
          return new Date(a.dueDate) - new Date(b.dueDate);
        }
        if (sortBy === 'createdAt') {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'priority') {
          const pOrder = { High: 1, Medium: 2, Low: 3 };
          return (pOrder[a.priority] || 2) - (pOrder[b.priority] || 2);
        }
        return 0;
      });
  }, [tasks, searchTerm, statusFilter, subjectFilter, priorityFilter, sortBy]);

  if (loadingTasks) {
    return <LoadingSpinner size="lg" label="Loading tasks directory..." />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Title & Add Button Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Academic Tasks & Assignments
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage, filter, sort, and track all your course requirements in one place
          </p>
        </div>

        <button
          onClick={onOpenNewTaskModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md shadow-brand-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Task</span>
        </button>
      </div>

      {/* Comprehensive Search & Filter Control Bar */}
      <TaskFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        subjectFilter={subjectFilter}
        onSubjectFilterChange={setSubjectFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        availableSubjects={availableSubjects}
      />

      {/* Task Count & Active Filters Indicator */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>
          Showing <strong className="text-slate-900 dark:text-white">{filteredAndSortedTasks.length}</strong> of {tasks.length} total tasks
        </span>

        {(searchTerm || statusFilter !== 'All' || subjectFilter !== 'All' || priorityFilter !== 'All') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('All');
              setSubjectFilter('All');
              setPriorityFilter('All');
            }}
            className="text-brand-600 dark:text-brand-400 font-semibold hover:underline"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Task List Display */}
      {filteredAndSortedTasks.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
          <SearchX className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No matching tasks found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
            Try adjusting your search keywords, clearing subject/priority filters, or create a new assignment task.
          </p>
          <button
            onClick={onOpenNewTaskModal}
            className="px-4 py-2 bg-brand-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-brand-700 transition-colors"
          >
            + Create New Assignment
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onToggleStatus={onToggleStatus}
            />
          ))}
        </div>
      ) : (
        <TaskTable
          tasks={filteredAndSortedTasks}
          onEdit={onEditTask}
          onDelete={onDeleteTask}
          onToggleStatus={onToggleStatus}
        />
      )}
    </div>
  );
};

export default TasksPage;
