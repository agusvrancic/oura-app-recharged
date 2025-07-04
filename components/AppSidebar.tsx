'use client'

import { ListTodo, MoreHorizontal, LogOut, Settings } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link'

// Menu items
const items = [
  {
    title: "Your Tasks",
    url: "/",
    icon: ListTodo,
  },
]

export function AppSidebar() {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <aside className="w-[250px] bg-white border-r border-gray-200 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-8 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-neutral-900 rounded-[10px] flex items-center justify-center">
            <span className="text-white text-xl font-bold">O</span>
          </div>
          <div className="flex flex-col">
            <span className="text-neutral-900 text-base font-bold leading-tight font-dm-sans">
              Oura.io
            </span>
            <span className="text-neutral-400 text-xs leading-none mt-1 font-dm-sans">
              Free Plan
            </span>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 pt-2 overflow-y-auto">
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.title}>
              <Link 
                href={item.url}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <item.icon className="w-4 h-4" />
                <span className="text-[13px] font-medium">{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 flex-shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 w-full text-left transition-colors">
              <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-gray-600 font-medium text-sm font-dm-sans">
                  {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-normal text-gray-900 truncate font-dm-sans">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate font-dm-sans">{user?.email}</p>
              </div>
              <MoreHorizontal className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="end" className="w-[200px]">
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
    </aside>
  )
} 