import { Metadata } from 'next';
import RegisterForm from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Create Account - Saidia Bay Real Estate',
  description: 'Create a free account to save your favorite properties and manage your reservations.',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-secondary-50 py-16">
      <div className="container mx-auto">
        <RegisterForm />
      </div>
    </div>
  );
}

