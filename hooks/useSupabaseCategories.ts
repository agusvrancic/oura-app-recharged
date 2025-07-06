'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Category } from '@/types/task'

export function useSupabaseCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  // Fetch categories from Supabase
  const fetchCategories = async () => {
    if (!user) {
      setCategories([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

      if (error) throw error

      // Transform database format to app format
      const transformedCategories: Category[] = data?.map(category => ({
        id: category.id,
        name: category.name,
        icon: category.icon || undefined,
        color: category.color || undefined,
        createdAt: category.created_at
      })) || []

      setCategories(transformedCategories)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Add new category
  const addCategory = async (name: string, icon?: string, color?: string) => {
    if (!user) throw new Error('User not authenticated')

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([
          {
            name,
            icon: icon || null,
            color: color || null,
            user_id: user.id
          }
        ])
        .select()
        .single()

      if (error) throw error

      // Transform and add to local state
      const newCategory: Category = {
        id: data.id,
        name: data.name,
        icon: data.icon || undefined,
        color: data.color || undefined,
        createdAt: data.created_at
      }

      setCategories(prev => [...prev, newCategory])
      return newCategory
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add category')
      throw err
    }
  }

  // Update category
  const updateCategory = async (id: string, updates: Partial<Omit<Category, 'id' | 'createdAt'>>) => {
    if (!user) throw new Error('User not authenticated')

    try {
      const { data, error } = await supabase
        .from('categories')
        .update({
          name: updates.name,
          icon: updates.icon || null,
          color: updates.color || null
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error

      // Update local state
      setCategories(prev => prev.map(category => 
        category.id === id 
          ? {
              id: data.id,
              name: data.name,
              icon: data.icon || undefined,
              color: data.color || undefined,
              createdAt: data.created_at
            }
          : category
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category')
      throw err
    }
  }

  // Delete category
  const deleteCategory = async (id: string) => {
    if (!user) throw new Error('User not authenticated')

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      // Remove from local state
      setCategories(prev => prev.filter(category => category.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category')
      throw err
    }
  }

  // Create default categories for new users
  const createDefaultCategories = async () => {
    if (!user) throw new Error('User not authenticated')

    const defaultCategories = [
      { name: 'Personal', icon: '👤', color: '#3B82F6' },
      { name: 'Work', icon: '💼', color: '#10B981' },
      { name: 'Health', icon: '🏥', color: '#EF4444' },
      { name: 'Learning', icon: '📚', color: '#8B5CF6' }
    ]

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert(
          defaultCategories.map(cat => ({
            ...cat,
            user_id: user.id
          }))
        )
        .select()

      if (error) throw error

      // Transform and add to local state
      const newCategories: Category[] = data?.map(category => ({
        id: category.id,
        name: category.name,
        icon: category.icon || undefined,
        color: category.color || undefined,
        createdAt: category.created_at
      })) || []

      setCategories(prev => [...prev, ...newCategories])
      return newCategories
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create default categories')
      throw err
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [user])

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    createDefaultCategories,
    refetch: fetchCategories
  }
} 