export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean; // Keep for backward compatibility, will be derived from status
  status: 'todo' | 'in-progress' | 'done';
  dueDate?: string;
  category?: string;
  priority?: 'High' | 'Mid' | 'Low';
  timeRange?: string; // e.g., "10:00 - 12:00"
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  createdAt: string;
}

export type FilterType = 'All' | 'Pending' | 'Completed'; 