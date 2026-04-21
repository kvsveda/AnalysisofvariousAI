import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';

// Import Clerk Components
import { 
  SignedIn, 
  SignedOut, 
  RedirectToSignIn, 
  SignIn, 
  SignUp 
} from '@clerk/clerk-react';

import HomePage      from './pages/HomePage';
import LoginPage     from './pages/LoginPage'; // You can keep these or use Clerk's UI
import SignupPage    from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage   from './pages/HistoryPage';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: { borderRadius: '12px', fontSize: '14px' },
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          
          {/* Clerk-specific Public Routes (Redirect to Dashboard if logged in) */}
          <Route path="/login" element={
            <SignedOut><LoginPage /></SignedOut>
          } />
          <Route path="/signup" element={
            <SignedOut><SignupPage /></SignedOut>
          } />

          {/* Protected Routes — Redirect to Clerk Sign-In if not logged in */}
          <Route path="/analyze" element={
            <>
              <SignedIn><DashboardPage /></SignedIn>
              <SignedOut><RedirectToSignIn /></SignedOut>
            </>
          } />
          
          <Route path="/history" element={
            <>
              <SignedIn><HistoryPage /></SignedIn>
              <SignedOut><RedirectToSignIn /></SignedOut>
            </>
          } />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}