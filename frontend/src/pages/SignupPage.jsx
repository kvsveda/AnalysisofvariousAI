import { SignUp } from '@clerk/clerk-react';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <SignUp
        routing="path"
        path="/signup"
        signInUrl="/login"
        forceRedirectUrl="/dashboard"
      />
    </div>
  );
}
