import { useAuth, UserButton, useUser } from '@clerk/clerk-react';
import React from 'react';

export default function DashboardPage() {
  const { getToken } = useAuth();
  const { isLoaded, isSignedIn, user } = useUser();
  const [prompt, setPrompt] = React.useState('Explain how gradient descent works in simple terms.');
  const [result, setResult] = React.useState(null);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const callApi = React.useCallback(async (path, options = {}) => {
    const token = await getToken();
    if (!token) {
      throw new Error('No Clerk token available. Please sign in again.');
    }

    const response = await fetch(path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }
    return data;
  }, [getToken]);

  React.useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      return;
    }

    callApi('/api/auth/sync', { method: 'POST' }).catch((err) => {
      setError(err.message || 'Failed to sync user');
    });
  }, [isLoaded, isSignedIn, callApi]);

  const runAnalysis = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await callApi('/api/analysis/run', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
      });
      setResult(data);
    } catch (err) {
      setError(err.message || 'Analysis request failed');
    } finally {
      setLoading(false);
    }
  };

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
            Welcome, {user.firstName || 'User'}
          </h1>
          <p className="text-gray-500 text-sm">{user.primaryEmailAddress?.emailAddress || 'No email'}</p>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400">Account</span>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <main className="grid grid-cols-1 gap-6">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <label className="block text-sm font-medium mb-2">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full min-h-[140px] p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
          />

          <div className="mt-4">
            <button
              type="button"
              onClick={runAnalysis}
              disabled={loading}
              className="px-4 py-2 rounded-md bg-black text-white disabled:opacity-60"
            >
              {loading ? 'Running...' : 'Run Analysis'}
            </button>
          </div>

          {error && <p className="mt-3 text-red-600 text-sm">{error}</p>}
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold mb-2">Latest Result</h3>
          <pre className="text-xs overflow-auto bg-gray-100 dark:bg-gray-900 p-3 rounded-lg">
            {result ? JSON.stringify(result, null, 2) : 'No analysis yet.'}
          </pre>
        </div>
      </main>
    </div>
  );
}