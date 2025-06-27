'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function AuthPage() {
  const [loading, setLoading] = useState(false)
  const { signInWithGoogle } = useAuth()

  const handleSignIn = async () => {
    try {
      setLoading(true)
      await signInWithGoogle()
    } catch (error) {
      console.error('Error signing in:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to TaskApp</h1>
          <p className="text-gray-600">Sign in to manage your tasks</p>
        </div>
        
        <Button 
          onClick={handleSignIn}
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </Button>
        
        <p className="mt-4 text-sm text-gray-500">
          Secure authentication powered by Supabase
        </p>
      </Card>
    </div>
  )
} 