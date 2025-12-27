import { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Login - Saidia Bay Real Estate',
  description: 'Sign in to your Saidia Bay Real Estate account to manage your properties and reservations.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-secondary-50 py-16">
      <div className="container mx-auto">
        <LoginForm />
      </div>
    </div>
  );
}
