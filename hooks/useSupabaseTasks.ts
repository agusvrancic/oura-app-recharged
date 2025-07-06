'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Task } from '@/types/task'

export function useSupabaseTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  // Fetch tasks from Supabase with category information
  const fetchTasks = async () => {
    if (!user) {
      setTasks([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          categories (
            id,
            name,
            icon,
            color
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Transform database format to app format
      const transformedTasks: Task[] = data?.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description || undefined,
        completed: task.completed,
        dueDate: task.due_date || undefined,
        category: task.category_id || undefined, // Use category_id instead of category name
        priority: task.priority || undefined,
        timeRange: task.time_range || undefined,
        createdAt: task.created_at,
        updatedAt: task.updated_at
      })) || []
      setTasks(transformedTasks)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Add new task with category and priority support
  const addTask = async (
    title: string, 
    description?: string, 
    dueDate?: string,
    categoryId?: string,
    priority?: 'High' | 'Mid' | 'Low',
    timeRange?: string
  ) => {
    if (!user) throw new Error('User not authenticated')

    console.log('Creating task with:', { title, description, dueDate, categoryId, priority, timeRange });

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            title,
            description: description || null,
            due_date: dueDate || null,
            category_id: categoryId || null,
            priority: priority || null,
            time_range: timeRange || null,
            user_id: user.id,
            completed: false
          }
        ])
        .select(`
          *,
          categories (
            id,
            name,
            icon,
            color
          )
        `)
        .single()

      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }

      console.log('Task creation response:', data);

      // Transform and add to local state
      const newTask: Task = {
        id: data.id,
        title: data.title,
        description: data.description || undefined,
        completed: data.completed,
        dueDate: data.due_date || undefined,
        category: data.category_id || undefined, // Use category_id instead of category name
        priority: data.priority || undefined,
        timeRange: data.time_range || undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }

      console.log('Transformed task:', newTask);
      setTasks(prev => {
        const updated = [newTask, ...prev];
        console.log('Updated tasks list:', updated);
        return updated;
      });
      return newTask
    } catch (err) {
      console.error('Add task error:', err);
      setError(err instanceof Error ? err.message : 'Failed to add task')
      throw err
    }
  }

  // Update task with category and priority support
  const updateTask = async (id: string, updates: Partial<Omit<Task, 'id'>>) => {
    if (!user) throw new Error('User not authenticated')

    try {
      // First, get the category_id if category name is provided
      let categoryId = null
      if (updates.category) {
        const { data: categoryData } = await supabase
          .from('categories')
          .select('id')
          .eq('name', updates.category)
          .eq('user_id', user.id)
          .single()
        
        categoryId = categoryData?.id || null
      }

      const { data, error } = await supabase
        .from('tasks')
        .update({
          title: updates.title,
          description: updates.description || null,
          due_date: updates.dueDate || null,
          category_id: categoryId,
          priority: updates.priority || null,
          time_range: updates.timeRange || null,
          completed: updates.completed,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select(`
          *,
          categories (
            id,
            name,
            icon,
            color
          )
        `)
        .single()

      if (error) throw error

      // Update local state
      setTasks(prev => prev.map(task => 
        task.id === id 
          ? {
              id: data.id,
              title: data.title,
              description: data.description || undefined,
              completed: data.completed,
              dueDate: data.due_date || undefined,
              category: data.category_id || undefined, // Use category_id instead of category name
              priority: data.priority || undefined,
              timeRange: data.time_range || undefined,
              createdAt: data.created_at,
              updatedAt: data.updated_at
            }
          : task
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task')
      throw err
    }
  }

  // Delete task
  const deleteTask = async (id: string) => {
    if (!user) throw new Error('User not authenticated')

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      // Remove from local state
      setTasks(prev => prev.filter(task => task.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task')
      throw err
    }
  }

  // Toggle task completion
  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return

    await updateTask(id, { completed: !task.completed })
  }

  // Edit task with full parameter support
  const editTask = async (
    id: string, 
    title: string, 
    description?: string, 
    dueDate?: string,
    category?: string,
    priority?: 'High' | 'Mid' | 'Low',
    timeRange?: string
  ) => {
    await updateTask(id, { title, description, dueDate, category, priority, timeRange })
  }

  useEffect(() => {
    fetchTasks()
  }, [user])

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    editTask,
    refetch: fetchTasks
  }
} 