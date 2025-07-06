'use client';

import { useState, useMemo } from 'react';
import { useSupabaseTasks } from '@/hooks/useSupabaseTasks';
import { useSupabaseCategories } from '@/hooks/useSupabaseCategories';
// import { useMockTasks } from '@/hooks/useMockTasks';
// import { useCategories } from '@/hooks/useCategories';
import { useAuth } from '@/contexts/AuthContext';
import { CreateTaskDialog } from '@/components/CreateTaskDialog';
import { CreateCategoryDialog } from '@/components/CreateCategoryDialog';
import { CategoryTabs } from '@/components/CategoryTabs';
import { CategorySection } from '@/components/CategorySection';
import { TaskCard } from '@/components/TaskCard';
import { EmptyState } from '@/components/EmptyState';
import { FilterType, Task } from '@/types/task';

export default function Home() {
  const { user } = useAuth();
  const { tasks, addTask, toggleTask, editTask, deleteTask, loading } = useSupabaseTasks();
  const { categories, addCategory } = useSupabaseCategories();
  
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['work', 'home', 'uncategorized']));
  const [isCreateCategoryDialogOpen, setIsCreateCategoryDialogOpen] = useState(false);
  
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Filter tasks based on active filter and category
  const filteredTasks = useMemo(() => {
    let filtered = tasks;
    
    // Apply filter
    if (activeFilter === 'Pending') {
      filtered = filtered.filter(task => !task.completed);
    } else if (activeFilter === 'Completed') {
      filtered = filtered.filter(task => task.completed);
    }
    
    // Apply category filter
    if (activeCategory) {
      filtered = filtered.filter(task => task.category === activeCategory);
    }
    
    return filtered;
  }, [tasks, activeFilter, activeCategory]);

  // Group tasks by category
  const tasksByCategory = useMemo(() => {
    const grouped = new Map<string, Task[]>();
    
    categories.forEach(category => {
      grouped.set(category.id, []);
    });
    
    // Add uncategorized group
    grouped.set('uncategorized', []);
    
    filteredTasks.forEach((task: Task) => {
      const categoryId = task.category || 'uncategorized';
      const categoryTasks = grouped.get(categoryId) || [];
      categoryTasks.push(task);
      grouped.set(categoryId, categoryTasks);
    });
    
    return grouped;
  }, [filteredTasks, categories]);

  const toggleCategoryExpanded = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleAddCategory = () => {
    setIsCreateCategoryDialogOpen(true);
  };

  const handleCreateCategory = (name: string, icon?: string) => {
    addCategory(name, icon);
    // Note: The newly created category will be automatically visible since 
    // categories without tasks are filtered out in the render logic
  };

  const handleAddTaskWithCategory = (categoryId: string) => (title: string, description?: string, dueDate?: string, categoryIdParam?: string, priority?: 'High' | 'Mid' | 'Low', timeRange?: string) => {
    // Use the provided categoryId or fall back to the categoryId from the section
    const finalCategoryId = categoryIdParam || categoryId;
    addTask(title, description, dueDate, finalCategoryId, priority, timeRange);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[24px] font-regular text-neutral-900">
            Hello, Username! <span className="hand">👋</span>
          </h1>
          <p className="text-[14px] text-neutral-500 mt-1 font-dm-sans">
            {currentDate}
          </p>
        </div>
        <CreateTaskDialog onCreateTask={(title, description, dueDate, categoryId, priority, timeRange) => addTask(title, description, dueDate, categoryId, priority, timeRange)} />
      </div>

      {/* Category Tabs */}
      <CategoryTabs
        categories={categories}
        activeFilter={activeFilter}
        activeCategory={activeCategory}
        onFilterChange={setActiveFilter}
        onCategoryChange={setActiveCategory}
        onAddCategory={handleAddCategory}
      />

      {/* Content */}
      <div className="flex-1">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            <span className="ml-2 text-gray-600">Loading tasks...</span>
          </div>
        ) : filteredTasks.length === 0 ? (
          <EmptyState />
        ) : activeCategory ? (
          // Single category view
          <div>
            {filteredTasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onToggle={toggleTask}
                onEdit={editTask}
                onDelete={deleteTask}
              />
            ))}
          </div>
        ) : (
          // Category sections view
          <div className="space-y-6">
            {categories.map((category) => {
              const categoryTasks = tasksByCategory.get(category.id) || [];
              if (categoryTasks.length === 0) return null;
              
              return (
                <CategorySection
                  key={category.id}
                  category={category}
                  tasks={categoryTasks}
                  isExpanded={expandedCategories.has(category.id)}
                  onToggleExpanded={() => toggleCategoryExpanded(category.id)}
                  onToggleTask={toggleTask}
                  onEditTask={editTask}
                  onDeleteTask={deleteTask}
                  onAddTask={handleAddTaskWithCategory(category.id)}
                />
              );
            })}
            
            {/* Uncategorized tasks */}
            {(() => {
              const uncategorizedTasks = tasksByCategory.get('uncategorized') || [];
              if (uncategorizedTasks.length === 0) return null;
              
              return (
                <CategorySection
                  category={{
                    id: 'uncategorized',
                    name: 'Uncategorized',
                    createdAt: new Date().toISOString(),
                  }}
                  tasks={uncategorizedTasks}
                  isExpanded={expandedCategories.has('uncategorized')}
                  onToggleExpanded={() => toggleCategoryExpanded('uncategorized')}
                  onToggleTask={toggleTask}
                  onEditTask={editTask}
                  onDeleteTask={deleteTask}
                  onAddTask={(title, description, dueDate, categoryId, priority, timeRange) => addTask(title, description, dueDate, categoryId, priority, timeRange)}
                />
              );
            })()}
          </div>
        )}
      </div>

      {/* Create Category Dialog */}
      <CreateCategoryDialog
        open={isCreateCategoryDialogOpen}
        onOpenChange={setIsCreateCategoryDialogOpen}
        onCreateCategory={handleCreateCategory}
      />
    </div>
  );
} 