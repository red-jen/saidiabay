'use client';
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { setUser } from '@/lib/auth/session';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log('Form data being sent:', formData);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors
        if (data.error && data.details) {
          const errorMessages = data.details.map((d: any) => d.message).join(', ');
          throw new Error(errorMessages);
        }
        throw new Error(data.message || 'Erreur de connexion');
      }

      // Check if OTP is required (for admin users)
      if (data.requiresOTP) {
        showToast(data.message || 'Code OTP envoyé', 'info');
        // Redirect to OTP verification page with userId
        router.push(`/login/verify-otp?userId=${data.userId}`);
        return;
      }

      // Store user data in localStorage for authentication check
      if (data.user) {
        setUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
        });
      }

      showToast('Connexion réussie', 'success');

      // Small delay to ensure localStorage is updated before navigation
      await new Promise(resolve => setTimeout(resolve, 100));

      // Redirect based on user role
      const redirect = searchParams.get('redirect');
      if (redirect) {
        window.location.href = redirect;
      } else if (data.user.role === 'ADMIN') {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/user/reservations';
      }
    } catch (error: any) {
      showToast(error.message || 'Erreur de connexion', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Connexion</h2>
          <p className="mt-2 text-sm text-gray-600">
            Connectez-vous à votre compte
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email ou nom d'utilisateur"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              required
              autoFocus
              placeholder="email@exemple.com ou username"
            />

            <Input
              label="Mot de passe"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Se souvenir de moi
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-700"
                >
                  Mot de passe oublié?
                </Link>
              </div>
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Se connecter
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-600">Pas encore de compte? </span>
              <Link
                href="/register"
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                S'inscrire
              </Link>
            </div>
          </form>
        </Card>

        <div className="text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-700">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}