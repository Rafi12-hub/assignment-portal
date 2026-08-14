import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';

const DEMO_TASKS_KEY = 'student_portal_demo_tasks';

// Initial sample tasks for Demo Mode
const INITIAL_DEMO_TASKS = [
  {
    id: 'demo-task-1',
    title: 'Data Structures & Algorithms Assignment 4',
    description: 'Implement AVL Tree balancing operations and calculate time complexity for insertion, deletion, and searching.',
    subject: 'Computer Science',
    dueDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0], // 2 days from now
    priority: 'High',
    status: 'Pending',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    userId: 'demo_student_123'
  },
  {
    id: 'demo-task-2',
    title: 'Database Systems Normalization Case Study',
    description: 'Convert unnormalized university registration tables to 1NF, 2NF, 3NF and BCNF formats with ER diagrams.',
    subject: 'Database Engineering',
    dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0], // 5 days from now
    priority: 'Medium',
    status: 'Pending',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    userId: 'demo_student_123'
  },
  {
    id: 'demo-task-3',
    title: 'Web Application Security Lab Submission',
    description: 'Complete hands-on exercise on cross-site scripting (XSS) prevention and SQL injection sanitization.',
    subject: 'Cyber Security',
    dueDate: new Date(Date.now() + 1 * 86400000).toISOString().split('T')[0], // Tomorrow
    priority: 'High',
    status: 'Pending',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    userId: 'demo_student_123'
  },
  {
    id: 'demo-task-4',
    title: 'Software Engineering Sprint Planning Report',
    description: 'Document user stories, story points, velocity metrics, and burndown chart analysis for Sprint 2.',
    subject: 'Software Engineering',
    dueDate: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0], // Overdue by 1 day
    priority: 'Low',
    status: 'Completed',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    userId: 'demo_student_123'
  },
  {
    id: 'demo-task-5',
    title: 'Linear Algebra Vector Spaces Problem Set',
    description: 'Solve problems 1-15 on vector subspaces, linear independence, basis vectors, and matrix dimensions.',
    subject: 'Mathematics',
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], // 7 days from now
    priority: 'Medium',
    status: 'Pending',
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    userId: 'demo_student_123'
  }
];

// Helper to get local demo storage
const getLocalDemoTasks = (userId) => {
  const data = localStorage.getItem(DEMO_TASKS_KEY);
  if (!data) {
    localStorage.setItem(DEMO_TASKS_KEY, JSON.stringify(INITIAL_DEMO_TASKS));
    return INITIAL_DEMO_TASKS.filter(t => t.userId === userId || userId === 'demo_student_123');
  }
  try {
    const parsed = JSON.parse(data);
    return parsed.filter(t => t.userId === userId || userId === 'demo_student_123');
  } catch (e) {
    return INITIAL_DEMO_TASKS;
  }
};

const saveLocalDemoTasks = (tasks) => {
  localStorage.setItem(DEMO_TASKS_KEY, JSON.stringify(tasks));
};

// Fetch real-time tasks for a user
export const subscribeUserTasks = (userId, callback, onError) => {
  if (isFirebaseConfigured && db && userId) {
    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', userId)
    );
    
    return onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort tasks in memory by dueDate
      tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      callback(tasks);
    }, (error) => {
      console.error("Error subscribing to Firestore tasks:", error);
      if (onError) onError(error);
    });
  } else {
    // Demo Mode listener using standard callback
    const tasks = getLocalDemoTasks(userId);
    tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    callback(tasks);
    
    // Return dummy unsubscribe
    return () => {};
  }
};

// Fetch user tasks one-time
export const fetchUserTasks = async (userId) => {
  if (isFirebaseConfigured && db && userId) {
    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const tasks = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    return tasks;
  } else {
    const tasks = getLocalDemoTasks(userId);
    tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    return tasks;
  }
};

// Create a new task
export const createTask = async (taskData, userId) => {
  const newTaskPayload = {
    title: taskData.title.trim(),
    description: taskData.description ? taskData.description.trim() : '',
    subject: taskData.subject ? taskData.subject.trim() : 'General',
    dueDate: taskData.dueDate,
    priority: taskData.priority || 'Medium',
    status: taskData.status || 'Pending',
    createdAt: new Date().toISOString(),
    userId: userId
  };

  if (isFirebaseConfigured && db) {
    const docRef = await addDoc(collection(db, 'tasks'), {
      ...newTaskPayload,
      firestoreCreatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...newTaskPayload };
  } else {
    // Demo mode save
    const currentTasks = JSON.parse(localStorage.getItem(DEMO_TASKS_KEY) || JSON.stringify(INITIAL_DEMO_TASKS));
    const createdTask = {
      id: `demo-task-${Date.now()}`,
      ...newTaskPayload
    };
    currentTasks.unshift(createdTask);
    saveLocalDemoTasks(currentTasks);
    return createdTask;
  }
};

// Update an existing task
export const updateTask = async (taskId, updatedData) => {
  const payload = {
    title: updatedData.title.trim(),
    description: updatedData.description ? updatedData.description.trim() : '',
    subject: updatedData.subject ? updatedData.subject.trim() : 'General',
    dueDate: updatedData.dueDate,
    priority: updatedData.priority,
    status: updatedData.status,
    updatedAt: new Date().toISOString()
  };

  if (isFirebaseConfigured && db) {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, payload);
    return { id: taskId, ...payload };
  } else {
    const currentTasks = JSON.parse(localStorage.getItem(DEMO_TASKS_KEY) || JSON.stringify(INITIAL_DEMO_TASKS));
    const index = currentTasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      currentTasks[index] = { ...currentTasks[index], ...payload };
      saveLocalDemoTasks(currentTasks);
      return currentTasks[index];
    }
    throw new Error('Task not found');
  }
};

// Delete a task
export const deleteTask = async (taskId) => {
  if (isFirebaseConfigured && db) {
    const taskRef = doc(db, 'tasks', taskId);
    await deleteDoc(taskRef);
    return taskId;
  } else {
    const currentTasks = JSON.parse(localStorage.getItem(DEMO_TASKS_KEY) || JSON.stringify(INITIAL_DEMO_TASKS));
    const filtered = currentTasks.filter(t => t.id !== taskId);
    saveLocalDemoTasks(filtered);
    return taskId;
  }
};

// Toggle task status (Pending <-> Completed)
export const toggleTaskStatus = async (taskId, currentStatus) => {
  const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
  
  if (isFirebaseConfigured && db) {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {
      status: newStatus,
      updatedAt: new Date().toISOString()
    });
    return newStatus;
  } else {
    const currentTasks = JSON.parse(localStorage.getItem(DEMO_TASKS_KEY) || JSON.stringify(INITIAL_DEMO_TASKS));
    const index = currentTasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      currentTasks[index].status = newStatus;
      currentTasks[index].updatedAt = new Date().toISOString();
      saveLocalDemoTasks(currentTasks);
      return newStatus;
    }
    throw new Error('Task not found');
  }
};
