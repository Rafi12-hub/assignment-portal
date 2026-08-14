import React from 'react';
import { 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  SlidersHorizontal,
  ArrowUpDown
} from 'lucide-react';

const TaskFilterBar = ({ 
  searchTerm, 
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  subjectFilter,
  onSubjectFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  sortBy,
  onSortByChange,
  viewMode,
  onViewModeChange,
  availableSubjects = []
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
      {/* Top Row: Search Input & View Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by assignment title, subject, or description..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
          />
        </div>

        {/* View Mode Toggle (Grid vs Table) */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-end sm:self-auto">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              viewMode === 'grid' 
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            title="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden md:inline">Grid</span>
          </button>
          <button
            onClick={() => onViewModeChange('table')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              viewMode === 'table' 
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            title="Table view"
          >
            <List className="w-4 h-4" />
            <span className="hidden md:inline">Table</span>
          </button>
        </div>
      </div>

      {/* Bottom Row: Filters & Sorting controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {['All', 'Pending', 'Completed'].map((status) => (
            <button
              key={status}
              onClick={() => onStatusFilterChange(status)}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                statusFilter === status 
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Dropdown Filters & Sort */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Subject Filter Dropdown */}
          <div className="flex items-center gap-1">
            <select
              value={subjectFilter}
              onChange={(e) => onSubjectFilterChange(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="All">All Subjects</option>
              {availableSubjects.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          {/* Priority Filter Dropdown */}
          <div className="flex items-center gap-1">
            <select
              value={priorityFilter}
              onChange={(e) => onPriorityFilterChange(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="title">Sort by Title</option>
              <option value="createdAt">Sort by Date Created</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskFilterBar;
