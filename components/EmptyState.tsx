import { Plus } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="p-8 flex flex-col items-center justify-center text-center">
      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Plus className="w-6 h-6 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 font-dm-sans">No tasks</h3>
      <p className="mt-1 text-sm text-gray-500 font-dm-sans">
        Create your first task clicking on '+ New Task'
      </p>
    </div>
  );
} 