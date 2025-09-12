import { useState, useEffect } from 'react';
import { Task, Category } from '@/types/task';

// Mock tasks data with categories and priorities
const mockTasks: Task[] = [
  // Work Tasks
  {
    id: '1',
    title: 'Complete project proposal',
    description: 'Finalize the Q4 project proposal for client review',
    completed: false,
    status: 'todo',
    category: 'work',
    priority: 'High',
    timeRange: '10:00 - 12:00',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days from now
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Team standup meeting',
    description: 'Daily sync with the development team',
    completed: false,
    status: 'in-progress',
    category: 'work',
    priority: 'Mid',
    timeRange: '09:00 - 09:30',
    dueDate: new Date().toISOString().split('T')[0], // Today
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Review code PRs',
    description: 'Review pending pull requests from team members',
    completed: false,
    status: 'todo',
    category: 'work',
    priority: 'Low',
    timeRange: '14:00 - 15:00',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Launch the Beta version',
    description: 'Deploy and announce the beta release',
    completed: true,
    status: 'done',
    category: 'work',
    priority: 'High',
    timeRange: '16:00 - 18:00',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Yesterday
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Prepare quarterly report',
    description: 'Compile data and insights for Q3 performance review',
    completed: false,
    status: 'in-progress',
    category: 'work',
    priority: 'High',
    timeRange: '13:00 - 16:00',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days from now
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  
  // Home Tasks
  {
    id: '6',
    title: 'Buy groceries',
    description: 'Get ingredients for dinner tonight',
    completed: false,
    status: 'todo',
    category: 'home',
    priority: 'High',
    timeRange: '18:00 - 19:00',
    dueDate: new Date().toISOString().split('T')[0], // Today
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '7',
    title: 'Clean the house',
    description: 'Weekly house cleaning routine',
    completed: false,
    status: 'in-progress',
    category: 'home',
    priority: 'Mid',
    timeRange: '10:00 - 12:00',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '8',
    title: 'Pay utility bills',
    description: 'Monthly utility bills payment',
    completed: false,
    status: 'todo',
    category: 'home',
    priority: 'Low',
    timeRange: '20:00 - 20:30',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '9',
    title: 'Fix the leaky faucet',
    description: 'Repair the kitchen faucet',
    completed: true,
    status: 'done',
    category: 'home',
    priority: 'Mid',
    timeRange: '15:00 - 16:00',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days ago
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '10',
    title: 'Water the plants',
    description: 'Weekly watering for indoor plants',
    completed: true,
    status: 'done',
    category: 'home',
    priority: 'Low',
    timeRange: '08:00 - 08:15',
    dueDate: new Date().toISOString().split('T')[0], // Today
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Groceries Tasks
  {
    id: '11',
    title: 'Buy milk and bread',
    description: 'Essential items for breakfast',
    completed: false,
    status: 'todo',
    category: 'groceries',
    priority: 'High',
    timeRange: '17:00 - 17:30',
    dueDate: new Date().toISOString().split('T')[0], // Today
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '12',
    title: 'Get fresh vegetables',
    description: 'Tomatoes, lettuce, carrots for salads',
    completed: false,
    status: 'todo',
    category: 'groceries',
    priority: 'Mid',
    timeRange: '17:30 - 18:00',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '13',
    title: 'Stock up on snacks',
    description: 'Healthy snacks for the week',
    completed: true,
    status: 'done',
    category: 'groceries',
    priority: 'Low',
    timeRange: '19:00 - 19:15',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Yesterday
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Uncategorized Tasks
  {
    id: '14',
    title: 'Call dentist for appointment',
    description: 'Schedule routine cleaning',
    completed: false,
    status: 'todo',
    priority: 'Mid',
    timeRange: '11:00 - 11:15',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '15',
    title: 'Update resume',
    description: 'Add recent projects and skills',
    completed: false,
    status: 'in-progress',
    priority: 'Low',
    timeRange: '19:00 - 21:00',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week from now
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function useMockTasks() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [loading, setLoading] = useState(false);

  const addTask = (title: string, description?: string, dueDate?: string, categoryId?: string, priority?: 'High' | 'Mid' | 'Low', timeRange?: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      completed: false,
      status: 'todo',
      dueDate,
      category: categoryId,
      priority,
      timeRange,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() }
          : task
      )
    );
  };

  const editTask = (id: string, title: string, description?: string, dueDate?: string, category?: string, priority?: 'High' | 'Mid' | 'Low', timeRange?: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { 
              ...task, 
              title, 
              description, 
              dueDate, 
              category,
              priority,
              timeRange,
              updatedAt: new Date().toISOString() 
            }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const updateTaskStatus = (id: string, status: 'todo' | 'in-progress' | 'done') => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { 
              ...task, 
              status, 
              completed: status === 'done',
              updatedAt: new Date().toISOString() 
            }
          : task
      )
    );
  };

  return {
    tasks,
    loading,
    addTask,
    toggleTask,
    editTask,
    deleteTask,
    updateTaskStatus,
  };
}

// Mock categories data
const mockCategories: Category[] = [
  {
    id: 'work',
    name: 'Work',
    icon: '💼',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'home',
    name: 'Home',
    icon: '🏠',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'groceries',
    name: 'Groceries',
    icon: '🛒',
    createdAt: new Date().toISOString(),
  },
];

export function useMockCategories() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);

  const addCategory = async (name: string, icon?: string) => {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name,
      icon,
      createdAt: new Date().toISOString(),
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = async (id: string, updates: { name?: string; icon?: string }) => {
    setCategories(prev => prev.map(cat => 
      cat.id === id ? { ...cat, ...updates } : cat
    ));
  };

  const deleteCategory = async (id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
  };

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
} 