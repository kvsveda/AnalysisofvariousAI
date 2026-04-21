import React from 'react';
import { useUser, UserButton } from '@clerk/clerk-react';

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();

  // 1. Wait for Clerk to load the user state
  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="animate-pulse">Loading your profile...</p>
      </div>
    );
  }

  // 2. Safety check (though the Route Guard in App.js should handle this)
  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <header className="flex justify-between items-center mb-8 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Welcome, {user.firstName || 'User'}! 👋
          </h1>
          <p className="text-gray-500 text-sm">{user.primaryEmailAddress.emailAddress}</p>
        </div>
        
        {/* This button allows users to manage their account and sign out */}
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400">Settings</span>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Placeholder cards for your actual app features */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold mb-2">My Analysis</h3>
          <p className="text-gray-500 text-sm">No data analyzed yet.</p>
        </div>
      </main>
    </div>
  );
}