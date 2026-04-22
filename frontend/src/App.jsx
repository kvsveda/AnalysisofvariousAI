import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

function Home() {
  return <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login/*" element={<LoginPage />} />
        <Route path="/sign-in/*" element={<LoginPage />} />
        <Route path="/signup/*" element={<SignupPage />} />
        <Route path="/sign-up/*" element={<SignupPage />} />
        <Route
          path="/dashboard"
          element={
            <>
              <SignedIn>
                <DashboardPage />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}