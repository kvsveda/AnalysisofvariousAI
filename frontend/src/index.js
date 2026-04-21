import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ClerkProvider } from '@clerk/clerk-react';

// 1. Grab your Publishable Key from the Clerk Dashboard
const PUBLISHABLE_KEY = "pk_test_Z2FtZS1tYXN0b2Rvbi0yNC5jbGVyay5hY2NvdW50cy5kZXYk"; // Replace with your actual key

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 2. Wrap your App in ClerkProvider */}
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <App />
    </ClerkProvider>
  </React.StrictMode>
);