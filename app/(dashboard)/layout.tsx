'use client';

import { useAuth } from '@/contexts/AuthContext';
import { AuthPage } from '@/components/AuthPage';
import { AppTopbar } from '@/components/AppTopbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <AppTopbar />
      <main className="flex-1 bg-white overflow-y-auto">
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8 lg:py-10 w-full max-w-none">
          {children}
        </div>
      </main>
    </div>
  );
} 