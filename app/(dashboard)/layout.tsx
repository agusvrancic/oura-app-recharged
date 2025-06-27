import Link from 'next/link';
import { ListTodo, Menu } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      {/* Sidebar */}
      <div className="w-[280px] px-4 py-6 bg-white border-r border-neutral-200 flex flex-col">
        {/* Top Section */}
        <div className="space-y-6">
          {/* Logo and Menu */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-neutral-900 rounded-[10px] flex items-center justify-center">
                <span className="text-white text-xl font-bold">O</span>
              </div>
              <div className="flex flex-col">
                <span className="text-neutral-900 text-base font-bold font-dm-sans leading-tight ">
                  Oura.io
                </span>
                <span className="text-black/40 text-xs leading-none font-dm-sans mt-1">
                  Free Plan
                </span>
              </div>
            </Link>
            <button className="text-black/50">
              <Menu className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation */}
          <nav>
            <Link
              href="/"
              className="flex items-center gap-2.5 px-3 py-3 bg-[#F3F3F3] hover:bg-[#EEEEEE] rounded-xl text-[14px] font-normal text-neutral-900"
            >
              <ListTodo className="h-[18px] w-[18px]" />
              Your Tasks
            </Link>
          </nav>
        </div>

        {/* User Profile */}
        <div className="mt-auto pt-6 border-t border-neutral-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-neutral-100 rounded-full flex items-center justify-center">
                <span className="text-neutral-400 text-sm">MR</span>
              </div>
              <div className="flex flex-col">
                <span className="text-neutral-900 text-sm font-medium font-dm-sans leading-tight">
                  Michael Robinson
                </span>
                <span className="text-black/40 text-xs leading-none font-dm-sans mt-1">
                  michael.robin@gmail.com
                </span>
              </div>
            </div>
            <button className="text-black/50">•••</button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-[80px] py-[40px]">
        {children}
      </main>
    </div>
  );
} 