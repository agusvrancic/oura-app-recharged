import { useState } from 'react';
import { Task } from '@/types/task';

export interface MockCategory {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  createdAt: string;
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design new homepage layout',
    description: 'Create wireframes and mockups for the new homepage design',
    completed: false,
    status: 'todo',
    dueDate: '2024-01-15',
    category: 'work',
    priority: 'High',
    timeRange: '09:00 - 11:00',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z',
  },
  {
    id: '2',
    title: 'Review pull requests',
    description: 'Review and approve pending pull requests from the team',
    completed: false,
    status: 'todo',
    dueDate: '2024-01-12',
    category: 'work',
    priority: 'Mid',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
  },
  {
    id: '3',
    title: 'Grocery shopping',
    description: 'Buy ingredients for weekend meal prep',
    completed: false,
    status: 'todo',
    dueDate: '2024-01-13',
    category: 'personal',
    priority: 'Low',
    timeRange: '14:00 - 15:30',
    createdAt: '2024-01-09T15:00:00Z',
    updatedAt: '2024-01-09T15:00:00Z',
  },
  {
    id: '4',
    title: 'Complete project documentation',
    description: 'Finish writing API documentation and user guides',
    completed: true,
    status: 'done',
    dueDate: '2024-01-08',
    category: 'work',
    priority: 'High',
    createdAt: '2024-01-08T11:00:00Z',
    updatedAt: '2024-01-08T17:00:00Z',
  },
  {
    id: '5',
    title: 'Plan weekend trip',
    description: 'Research destinations and book accommodations',
    completed: false,
    status: 'in-progress',
    category: 'personal',
    priority: 'Low',
    createdAt: '2024-01-09T20:00:00Z',
    updatedAt: '2024-01-09T20:00:00Z',
  },
  {
    id: '6',
    title: 'Update team on project status',
    description: 'Send weekly status report to stakeholders',
    completed: true,
    status: 'done',
    dueDate: '2024-01-09',
    category: 'work',
    priority: 'Mid',
    createdAt: '2024-01-08T14:00:00Z',
    updatedAt: '2024-01-09T16:00:00Z',
  },
  {
    id: '7',
    title: 'Learn React Server Components',
    description: 'Study the new React Server Components pattern and implementation',
    completed: false,
    status: 'in-progress',
    dueDate: '2024-01-20',
    category: 'learning',
    priority: 'Mid',
    timeRange: '19:00 - 21:00',
    createdAt: '2024-01-10T19:00:00Z',
    updatedAt: '2024-01-10T19:00:00Z',
  },
  {
    id: '8',
    title: 'Fix authentication bug',
    description: 'Investigate and resolve the login redirect issue',
    completed: false,
    status: 'in-progress',
    dueDate: '2024-01-14',
    category: 'work',
    priority: 'High',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-10T08:00:00Z',
  }
];

const mockCategories: MockCategory[] = [
  {
    id: 'work',
    name: 'Work',
    icon: '💼',
    color: 'blue',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'home',
    name: 'Home',
    icon: '🏠',
    color: 'green',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'groceries',
    name: 'Groceries',
    icon: '🛒',
    color: 'red',
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export function useMockTasks() {
  // Enable mock tasks for preview
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
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        // Three-state cycle: todo → in-progress → done → todo
        let newStatus: 'todo' | 'in-progress' | 'done';
        
        if (task.status === 'todo') {
          newStatus = 'in-progress';
        } else if (task.status === 'in-progress') {
          newStatus = 'done';
        } else {
          newStatus = 'todo';
        }
        
        return { 
          ...task, 
          status: newStatus,
          completed: newStatus === 'done',
          updatedAt: new Date().toISOString() 
        };
      }
      return task;
    }));
  };

  const editTask = (id: string, title: string, description?: string, dueDate?: string, category?: string, priority?: 'High' | 'Mid' | 'Low', timeRange?: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { 
        ...task, 
        title, 
        description, 
        dueDate, 
        category, 
        priority, 
        timeRange, 
        // Keep completed field in sync with status
        completed: task.status === 'done',
        updatedAt: new Date().toISOString() 
      } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const updateTaskStatus = (id: string, status: 'todo' | 'in-progress' | 'done') => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { 
        ...task, 
        status, 
        completed: status === 'done',
        updatedAt: new Date().toISOString() 
      } : task
    ));
  };

  return {
    tasks,
    addTask,
    toggleTask,
    editTask,
    deleteTask,
    updateTaskStatus,
    loading,
  };
}

export function useMockCategories() {
  const [categories, setCategories] = useState<MockCategory[]>(mockCategories);

  const addCategory = async (name: string, icon?: string) => {
    const newCategory: MockCategory = {
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