export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
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