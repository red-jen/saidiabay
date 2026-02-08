'use client';
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { setUser } from '@/lib/auth/session';

export default function VerifyOTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const userId = searchParams.get('userId');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      showToast('Session invalide', 'error');
      router.push('/login');
      return;
    }

    setIsLoading(true);

    console.log('Sending OTP verification:', { userId, otpCode });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/auth/login/verify-otp`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ userId, otpCode }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Code OTP invalide');
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

      showToast('Connexion admin réussie', 'success');

      // Small delay to ensure localStorage is updated before navigation
      await new Promise(resolve => setTimeout(resolve, 100));

      // Redirect to dashboard (admin only feature)
      const redirect = searchParams.get('redirect');
      window.location.href = redirect || '/dashboard';
    } catch (error: any) {
      showToast(error.message || 'Erreur de vérification', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Vérification Admin</h2>
          <p className="mt-2 text-sm text-gray-600">
            Un code de vérification a été envoyé à <strong>saidiavibe@gmail.com</strong>
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Vérifiez votre boîte de réception et entrez le code à 6 chiffres
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Code OTP"
              name="otpCode"
              type="text"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              required
              autoFocus
              placeholder="Entrez le code à 6 chiffres"
              maxLength={6}
              pattern="[0-9]{6}"
            />

            <div className="text-xs text-gray-500">
              Le code est valide pendant 10 minutes
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Vérifier le code
            </Button>

            <div className="text-center text-sm">
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                ← Retour à la connexion
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
