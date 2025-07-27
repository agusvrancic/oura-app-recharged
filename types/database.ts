export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          icon: string | null
          color: string | null
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          icon?: string | null
          color?: string | null
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          icon?: string | null
          color?: string | null
          created_at?: string
          user_id?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          completed: boolean
          status: 'todo' | 'in-progress' | 'done'
          due_date: string | null
          category_id: string | null
          priority: 'High' | 'Mid' | 'Low' | null
          time_range: string | null
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          completed?: boolean
          status?: 'todo' | 'in-progress' | 'done'
          due_date?: string | null
          category_id?: string | null
          priority?: 'High' | 'Mid' | 'Low' | null
          time_range?: string | null
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          completed?: boolean
          status?: 'todo' | 'in-progress' | 'done'
          due_date?: string | null
          category_id?: string | null
          priority?: 'High' | 'Mid' | 'Low' | null
          time_range?: string | null
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
    }
  }
} 