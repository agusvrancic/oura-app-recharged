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
        status: task.status || 'todo', // Default to 'todo' if status is missing
        dueDate: task.due_date || undefined,
        category: task.category_id || undefined,
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
            completed: false,
            status: 'todo'
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
        throw error;
      }

      // Transform and add to local state
      const newTask: Task = {
        id: data.id,
        title: data.title,
        description: data.description || undefined,
        completed: data.completed,
        status: data.status || 'todo',
        dueDate: data.due_date || undefined,
        category: data.category_id || undefined,
        priority: data.priority || undefined,
        timeRange: data.time_range || undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }

      setTasks(prev => [newTask, ...prev])
      return newTask
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add task')
      throw err
    }
  }

  // Update task - fixed to preserve category when not explicitly updating it
  const updateTask = async (id: string, updates: Partial<Omit<Task, 'id'>>) => {
    if (!user) throw new Error('User not authenticated')

    try {
      // Create update object, only including fields that are being explicitly updated
      const updateData: any = {}
      
      if (updates.title !== undefined) updateData.title = updates.title
      if (updates.description !== undefined) updateData.description = updates.description || null
      if (updates.completed !== undefined) updateData.completed = updates.completed
      if (updates.status !== undefined) updateData.status = updates.status
      if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate || null
      if (updates.category !== undefined) updateData.category_id = updates.category || null
      if (updates.priority !== undefined) updateData.priority = updates.priority || null
      if (updates.timeRange !== undefined) updateData.time_range = updates.timeRange || null

      const { data, error } = await supabase
        .from('tasks')
        .update(updateData)
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

      // Transform and update local state
      const updatedTask: Task = {
        id: data.id,
        title: data.title,
        description: data.description || undefined,
        completed: data.completed,
        status: data.status || 'todo',
        dueDate: data.due_date || undefined,
        category: data.category_id || undefined,
        priority: data.priority || undefined,
        timeRange: data.time_range || undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }

      setTasks(prev => prev.map(task => 
        task.id === id ? updatedTask : task
      ))
      return updatedTask
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task')
      throw err
    }
  }

  // Update task status specifically for board functionality
  const updateTaskStatus = async (id: string, status: 'todo' | 'in-progress' | 'done') => {
    if (!user) throw new Error('User not authenticated')

    try {
      // Also update completed field to maintain backward compatibility
      const completed = status === 'done'
      
      const { data, error } = await supabase
        .from('tasks')
        .update({ 
          status,
          completed
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

      // Transform and update local state
      const updatedTask: Task = {
        id: data.id,
        title: data.title,
        description: data.description || undefined,
        completed: data.completed,
        status: data.status || 'todo',
        dueDate: data.due_date || undefined,
        category: data.category_id || undefined,
        priority: data.priority || undefined,
        timeRange: data.time_range || undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }

      setTasks(prev => prev.map(task => 
        task.id === id ? updatedTask : task
      ))
      return updatedTask
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task status')
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

  // Toggle task completion status
  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id)
    if (!task) throw new Error('Task not found')
    
    const newCompleted = !task.completed
    const newStatus = newCompleted ? 'done' : 'todo'
    
    await updateTask(id, { 
      completed: newCompleted,
      status: newStatus
    })
  }

  // Edit task with all fields
  const editTask = async (
    id: string, 
    title: string, 
    description?: string, 
    dueDate?: string,
    category?: string,
    priority?: 'High' | 'Mid' | 'Low',
    timeRange?: string
  ) => {
    await updateTask(id, {
      title,
      description,
      dueDate,
      category,
      priority,
      timeRange
    })
  }

  // Fetch tasks on component mount and when user changes
  useEffect(() => {
    fetchTasks()
  }, [user])

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    toggleTask,
    editTask,
    refetch: fetchTasks
  }
} 