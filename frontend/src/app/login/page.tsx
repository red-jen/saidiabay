import { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your SaidiaBay Real Estate account.',
};

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-secondary-800">Welcome Back</h1>
          <p className="text-secondary-600 mt-2">
            Sign in to your account to continue
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-secondary-100">
          <LoginForm />

          <div className="mt-6 text-center">
            <p className="text-secondary-600">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
