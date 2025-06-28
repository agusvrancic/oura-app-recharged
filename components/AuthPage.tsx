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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 border-neutral-200">
      <Card className="w-full max-w-md py-8 px-12 text-center rounded-[24px] shadow-lg">
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <img 
              src="/app-icon.png" 
              alt="App Icon" 
              className="w-16 h-16"
            />
          </div>
          <h1 className="text-[28px] font-bold font-dm-sans text-gray-900 mb-2">Welcome to Oura.io</h1>
          <p className="text-gray-500 text-[14px] font-dm-sans">Sign in to Oura to continue organizing your day and keep your productivity flowing.</p>
        </div>
        
        <Button 
          onClick={handleSignIn}
          disabled={loading}
          className="px-[32px] py-[16px] flex items-center justify-center text-center text-[14px] font-dm-sans w-auto mx-auto"
        >
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </Button>
        
        <p className="mt-4 text-xs text-gray-400">
          Secure authentication powered by Supabase
        </p>
      </Card>
    </div>
  )
} 