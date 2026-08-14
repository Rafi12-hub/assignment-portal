import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import TaskModal from '../tasks/TaskModal';
import Toast from '../common/Toast';
import { useAuth } from '../../context/AuthContext';
import { subscribeUserTasks, createTask, updateTask, deleteTask, toggleTaskStatus } from '../../services/taskService';
import confetti from 'canvas-confetti';

const Layout = () => {
  const { currentUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  
  // Task Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Toast state
  const [toast, setToast] = useState(null);

  // Subscribe to real-time tasks
  useEffect(() => {
    if (!currentUser?.uid) return;
    setLoadingTasks(true);

    const unsubscribe = subscribeUserTasks(
      currentUser.uid,
      (fetchedTasks) => {
        setTasks(fetchedTasks);
        setLoadingTasks(false);
      },
      (error) => {
        console.error("Task subscription error:", error);
        setLoadingTasks(false);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [currentUser?.uid]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Open modal to add a new task
  const handleOpenNewTaskModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  // Open modal to edit existing task
  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Save Task handler
  const handleSaveTask = async (taskFormData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, taskFormData);
        showToast('Task updated successfully!', 'success');
      } else {
        await createTask(taskFormData, currentUser.uid);
        showToast('New task added successfully!', 'success');
      }
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      console.error("Save task error:", err);
      showToast(err.message || 'Failed to save task', 'error');
    }
  };

  // Delete Task handler
  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        showToast('Task deleted successfully', 'info');
      } catch (err) {
        console.error("Delete task error:", err);
        showToast('Failed to delete task', 'error');
      }
    }
  };

  // Toggle Task Status (Pending <-> Completed)
  const handleToggleTaskStatus = async (taskId, currentStatus) => {
    try {
      const newStatus = await toggleTaskStatus(taskId, currentStatus);
      if (newStatus === 'Completed') {
        showToast('Task completed! 🎉', 'success');
        // Trigger celebratory confetti effect
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 }
        });
      } else {
        showToast('Task marked as pending', 'info');
      }
    } catch (err) {
      console.error("Status update error:", err);
      showToast('Failed to update status', 'error');
    }
  };

  // Compute Task Statistics for Navbar/Sidebar & Context
  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'Pending').length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    highPriority: tasks.filter(t => t.status === 'Pending' && t.priority === 'High').length,
    upcoming: tasks.filter(t => {
      if (t.status === 'Completed') return false;
      const due = new Date(t.dueDate);
      const today = new Date();
      today.setHours(0,0,0,0);
      const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    }).length
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors">
      <Navbar 
        onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        onOpenNewTaskModal={handleOpenNewTaskModal}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          isMobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
          onOpenNewTaskModal={handleOpenNewTaskModal}
          taskStats={taskStats}
        />

        {/* Main Content Area */}
        <main className="flex-1 md:ml-64 p-4 sm:p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          <Outlet context={{
            tasks,
            loadingTasks,
            taskStats,
            onOpenNewTaskModal: handleOpenNewTaskModal,
            onEditTask: handleEditTask,
            onDeleteTask: handleDeleteTask,
            onToggleStatus: handleToggleTaskStatus,
            showToast
          }} />
        </main>
      </div>

      {/* Reusable Task Form Modal */}
      {isModalOpen && (
        <TaskModal 
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTask(null);
          }}
          onSave={handleSaveTask}
          initialData={editingTask}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Layout;
