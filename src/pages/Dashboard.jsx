import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { 
  CheckSquare, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  ArrowRight, 
  Sparkles,
  BookOpen,
  TrendingUp,
  CalendarCheck
} from 'lucide-react';
import StatCard from '../components/tasks/StatCard';
import TaskCard from '../components/tasks/TaskCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { parseISO, isBefore, startOfDay } from 'date-fns';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { 
    tasks, 
    loadingTasks, 
    taskStats, 
    onOpenNewTaskModal, 
    onEditTask, 
    onDeleteTask, 
    onToggleStatus 
  } = useOutletContext();

  if (loadingTasks) {
    return <LoadingSpinner size="lg" label="Fetching assignment dashboard..." />;
  }

  const today = startOfDay(new Date());

  // Filter tasks due within the next 7 days or overdue (and pending)
  const upcomingDeadlines = tasks
    .filter(task => task.status === 'Pending')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  // Completion percentage
  const completionPercentage = taskStats.total > 0 
    ? Math.round((taskStats.completed / taskStats.total) * 100) 
    : 0;

  // Group tasks by subject for subject progress breakdown
  const subjectMap = {};
  tasks.forEach(t => {
    const sub = t.subject || 'General';
    if (!subjectMap[sub]) {
      subjectMap[sub] = { total: 0, completed: 0 };
    }
    subjectMap[sub].total += 1;
    if (t.status === 'Completed') subjectMap[sub].completed += 1;
  });

  const subjectsList = Object.keys(subjectMap);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-700 p-6 sm:p-8 text-white shadow-xl shadow-brand-500/15">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold text-brand-100 mb-3 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Academic Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hello, {currentUser?.displayName || 'Student'}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-brand-100/90 mt-1 max-w-xl">
              You have <span className="font-bold text-white">{taskStats.pending} pending assignment{taskStats.pending !== 1 ? 's' : ''}</span> and <span className="font-bold text-amber-300">{taskStats.highPriority} high priority task{taskStats.highPriority !== 1 ? 's' : ''}</span> requiring attention.
            </p>
          </div>

          <button
            onClick={onOpenNewTaskModal}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-white text-brand-700 hover:bg-brand-50 rounded-2xl text-xs font-extrabold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add New Assignment</span>
          </button>
        </div>
      </div>

      {/* Metric Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tasks"
          value={taskStats.total}
          subtext="Assignments cataloged"
          icon={CheckSquare}
          color="brand"
        />
        <StatCard
          title="Pending Tasks"
          value={taskStats.pending}
          subtext="Requires completion"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Completed Tasks"
          value={taskStats.completed}
          subtext={`${completionPercentage}% overall progress`}
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Upcoming Deadlines"
          value={taskStats.upcoming}
          subtext="Due in the next 7 days"
          icon={CalendarCheck}
          color="violet"
        />
      </div>

      {/* Progress & Subject Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Academic Progress Meter */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                Completion Progress
              </h3>
              <span className="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-full">
                {completionPercentage}% Done
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-3.5 rounded-full overflow-hidden mb-4">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {completionPercentage === 100 
                ? "Outstanding work! All assignments are submitted." 
                : completionPercentage >= 50 
                ? "Great progress! You are over halfway through your course tasks." 
                : "Keep going! Tackle high-priority deadlines first."
              }
            </p>
          </div>

          {/* Subject breakdown list */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Subject Breakdown
            </p>
            {subjectsList.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No subject categories yet.</p>
            ) : (
              subjectsList.slice(0, 4).map(sub => {
                const data = subjectMap[sub];
                const pct = Math.round((data.completed / data.total) * 100);
                return (
                  <div key={sub} className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[150px]">
                      {sub}
                    </span>
                    <span className="text-slate-400 font-semibold">
                      {data.completed}/{data.total} ({pct}%)
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Upcoming Deadlines Widget */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  Upcoming & Urgent Deadlines
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Priority assignments ordered by due date
                </p>
              </div>

              <Link 
                to="/tasks" 
                className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
              >
                <span>View All ({tasks.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {upcomingDeadlines.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No Pending Deadlines!</p>
                <p className="text-xs text-slate-400 mt-1">You have zero pending assignments due. Enjoy your free time!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingDeadlines.map((task) => {
                  const parsedDueDate = task.dueDate ? parseISO(task.dueDate) : null;
                  const isOverdue = parsedDueDate && isBefore(parsedDueDate, today);

                  return (
                    <div 
                      key={task.id} 
                      className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                        isOverdue 
                          ? 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60' 
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onToggleStatus(task.id, task.status)}
                          className="p-1 text-slate-400 hover:text-emerald-500 transition-colors"
                          title="Mark Complete"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-semibold px-2 py-0.5 bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 rounded">
                              {task.subject}
                            </span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                              task.priority === 'High' 
                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' 
                                : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                            }`}>
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`text-xs font-extrabold block ${
                          isOverdue ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'
                        }`}>
                          {task.dueDate}
                        </span>
                        <button
                          onClick={() => onEditTask(task)}
                          className="text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:underline"
                        >
                          Edit Task
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Tasks Card View Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
            Recent Assignments
          </h3>
          <Link 
            to="/tasks" 
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
          >
            Explore All Tasks &rarr;
          </Link>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-base font-bold text-slate-800 dark:text-slate-200">No assignments created yet!</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
              Start by clicking below to add your first course assignment or lab task.
            </p>
            <button
              onClick={onOpenNewTaskModal}
              className="px-4 py-2 bg-brand-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-brand-700 transition-colors"
            >
              + Create First Task
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.slice(0, 6).map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onToggleStatus={onToggleStatus}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
