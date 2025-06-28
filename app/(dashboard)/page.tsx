'use client';

import { useSupabaseTasks } from '@/hooks/useSupabaseTasks';
import { useAuth } from '@/contexts/AuthContext';
import { CreateTaskDialog } from '@/components/CreateTaskDialog';
import { TaskCard } from '@/components/TaskCard';
import { EmptyState } from '@/components/EmptyState';

export default function Home() {
  const { user } = useAuth();
  const { tasks, addTask, toggleTask, editTask, deleteTask, loading } = useSupabaseTasks();
  
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[24px] font-regular text-neutral-900">
            Hello, {user?.user_metadata?.full_name || user?.email}! <span className="hand">👋</span>
          </h1>
          <p className="text-[14px] text-neutral-500 mt-1 font-dm-sans">
            {currentDate}
          </p>
        </div>
        <CreateTaskDialog onCreateTask={addTask} />
      </div>

      {/* Content */}
      <div className="flex-1">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            <span className="ml-2 text-gray-600">Loading tasks...</span>
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onToggle={toggleTask}
                onEdit={editTask}
                onDelete={deleteTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 