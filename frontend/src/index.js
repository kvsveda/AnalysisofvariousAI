import { ClerkProvider } from '@clerk/clerk-react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const PUBLISHABLE_KEY =
  process.env.REACT_APP_CLERK_PUBLISHABLE_KEY ||
  'pk_test_Z2VudGxlLWNyYXdkYWQtNjguY2xlcmsuYWNjb3VudHMuZGV2JA';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      signInUrl="/login"
      signUpUrl="/signup"
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>
);