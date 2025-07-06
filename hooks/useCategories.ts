import { useState, useEffect, useCallback } from 'react';
import { Category } from '@/types/task';

// Mock categories data
const mockCategories: Category[] = [
  {
    id: 'home',
    name: 'Home',
    icon: '🏠',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'work',
    name: 'Work',
    icon: '💼',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'groceries',
    name: 'Groceries',
    icon: '🛒',
    createdAt: new Date().toISOString(),
  },
];

// Global state for categories
let globalCategories: Category[] = [...mockCategories];
let globalLoading = false;
const subscribers = new Set<() => void>();

// Subscribe to category changes
const subscribe = (callback: () => void) => {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
};

// Notify all subscribers of changes
const notifySubscribers = () => {
  subscribers.forEach(callback => callback());
};

// Global category operations
const addCategoryGlobal = (name: string, icon?: string) => {
  const newCategory: Category = {
    id: crypto.randomUUID(),
    name,
    icon,
    createdAt: new Date().toISOString(),
  };
  globalCategories = [...globalCategories, newCategory];
  notifySubscribers();
};

const deleteCategoryGlobal = (id: string) => {
  globalCategories = globalCategories.filter(cat => cat.id !== id);
  notifySubscribers();
};

const updateCategoryGlobal = (id: string, updates: Partial<Category>) => {
  globalCategories = globalCategories.map(cat => 
    cat.id === id ? { ...cat, ...updates } : cat
  );
  notifySubscribers();
};

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(globalCategories);
  const [loading, setLoading] = useState(globalLoading);

  useEffect(() => {
    // Set initial state
    setCategories(globalCategories);
    setLoading(globalLoading);

    // Subscribe to changes
    const unsubscribe = subscribe(() => {
      setCategories([...globalCategories]);
      setLoading(globalLoading);
    });

    return unsubscribe;
  }, []);

  const addCategory = useCallback((name: string, icon?: string) => {
    addCategoryGlobal(name, icon);
  }, []);

  const deleteCategory = useCallback((id: string) => {
    deleteCategoryGlobal(id);
  }, []);

  const updateCategory = useCallback((id: string, updates: Partial<Category>) => {
    updateCategoryGlobal(id, updates);
  }, []);

  return {
    categories,
    loading,
    addCategory,
    deleteCategory,
    updateCategory,
  };
} 