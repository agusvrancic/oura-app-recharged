'use client'

import { MoreHorizontal, LogOut, Settings } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AppTopbar() {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <header className="w-full bg-[#FAFAFA] border-b border-gray-200 px-6 py-2">
      <div className="flex items-center justify-between">
        {/* Left side - App branding */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 relative">
            <Image
              src="/app-icon.png"
              alt="Ora App Logo"
              width={36}
              height={36}
              className="rounded-[10px]"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-neutral-900 text-base font-bold leading-tight font-dm-sans">
              Oura
            </span>
            <span className="text-neutral-500 text-xs leading-none mt-1 font-dm-sans">
              Free Plan
            </span>
          </div>
        </div>

        {/* Right side - User account */}
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="hidden sm:flex flex-col items-end min-w-0">
                  <p className="text-sm font-normal text-gray-900 truncate font-dm-sans">
                    {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Michael Robinson'}
                  </p>
                  <p className="text-xs text-gray-500 truncate font-dm-sans">
                    {user?.email || 'michael.robin@gmail.com'}
                  </p>
                </div>
                <Avatar className="w-9 h-9 flex-shrink-0">
                  <AvatarImage 
                    src={user?.user_metadata?.avatar_url || ''} 
                    alt={user?.user_metadata?.full_name || 'User Avatar'} 
                  />
                  <AvatarFallback className="bg-gray-200 text-gray-600 font-medium text-sm font-dm-sans">
                    {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'MR'}
                  </AvatarFallback>
                </Avatar>
                <MoreHorizontal className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end" className="w-[200px]">
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-center gap-2 cursor-pointer text-red-600 hover:text-red-700"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
