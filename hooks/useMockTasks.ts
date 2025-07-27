import { useState, useEffect } from 'react';
import { Task } from '@/types/task';

// Mock tasks data with categories and priorities
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project proposal',
    description: 'Finalize the Q4 project proposal for client review',
    completed: false,
    status: 'todo',
    category: 'work',
    priority: 'High',
    timeRange: '10:00 - 12:00',
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Buy groceries',
    description: 'Get ingredients for dinner tonight',
    completed: false,
    status: 'todo',
    category: 'home',
    priority: 'High',
    timeRange: '18:00 - 19:00',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Clean the house',
    description: 'Weekly house cleaning routine',
    completed: false,
    status: 'in-progress',
    category: 'home',
    priority: 'Mid',
    timeRange: '10:00 - 12:00',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '7',
    title: 'Pay utility bills',
    description: 'Monthly utility bills payment',
    completed: false,
    status: 'todo',
    category: 'home',
    priority: 'Low',
    timeRange: '20:00 - 20:30',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '8',
    title: 'Fix the leaky faucet',
    description: 'Repair the kitchen faucet',
    completed: true,
    status: 'done',
    category: 'home',
    priority: 'Mid',
    timeRange: '15:00 - 16:00',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function useMockTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setTasks(mockTasks);
      setLoading(false);
    }, 500);
  }, []);

  const addTask = (title: string, description?: string, dueDate?: string, priority?: string, category?: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      completed: false,
      status: 'todo',
      dueDate,
      priority: priority as 'High' | 'Mid' | 'Low' | undefined,
      category,
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

  const editTask = (id: string, title: string, description?: string, dueDate?: string, priority?: string, category?: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { 
              ...task, 
              title, 
              description, 
              dueDate, 
              priority: priority as 'High' | 'Mid' | 'Low' | undefined,
              category,
              updatedAt: new Date().toISOString() 
            }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  return {
    tasks,
    loading,
    addTask,
    toggleTask,
    editTask,
    deleteTask,
  };
} 