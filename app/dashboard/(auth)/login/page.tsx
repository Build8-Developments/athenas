import { Suspense } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/logo.png"
            alt="Athenas Foods"
            width={64}
            height={64}
            className="mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Sign in to manage your products</p>
        </div>

        {/* Login Form with Suspense */}
        <Suspense
          fallback={
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            </div>
          }
        >
          <LoginForm />
        </Suspense>

        {/* Help text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Default credentials: admin / admin123
        </p>
      </div>
    </div>
  );
}
