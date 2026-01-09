'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

type Step = 'email' | 'reset';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [step, setStep] = useState<Step>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/auth/forgot-password/request`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'envoi du code');
      }

      showToast('Code de confirmation envoyé à votre email', 'success');
      setStep('reset');
    } catch (error: any) {
      showToast(error.message || 'Erreur lors de l\'envoi du code', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showToast('Les mots de passe ne correspondent pas', 'error');
      return;
    }

    if (newPassword.length < 6) {
      showToast('Le mot de passe doit contenir au moins 6 caractères', 'error');
      return;
    }

    if (!otpCode || otpCode.length !== 6) {
      showToast('Veuillez entrer le code à 6 chiffres', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/auth/forgot-password/reset`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email, 
            otpCode, 
            newPassword 
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la réinitialisation');
      }

      showToast('Mot de passe réinitialisé avec succès', 'success');
      
      // Rediriger vers la page de connexion
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (error: any) {
      showToast(error.message || 'Code invalide ou expiré', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/auth/forgot-password/request`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur');
      }

      showToast('Nouveau code envoyé', 'success');
    } catch (error: any) {
      showToast(error.message || 'Erreur', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Mot de passe oublié
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === 'email' && 'Entrez votre email pour recevoir un code de vérification'}
            {step === 'reset' && 'Entrez le code reçu et votre nouveau mot de passe'}
          </p>
        </div>

        <Card>
          {/* STEP 1: Email */}
          {step === 'email' && (
            <form onSubmit={handleSendCode} className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="votre@email.com"
                autoFocus
              />

              <Button type="submit" className="w-full" isLoading={isLoading}>
                Envoyer le code
              </Button>

              <div className="text-center">
                <Link
                  href="/login"
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  ← Retour à la connexion
                </Link>
              </div>
            </form>
          )}

          {/* STEP 2: Reset Password */}
          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-blue-800">
                  📧 Code envoyé à: <strong>{email}</strong>
                </p>
              </div>

              <Input
                label="Code de confirmation"
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                required
                placeholder="123456"
                maxLength={6}
                autoFocus
              />

              <Input
                label="Nouveau mot de passe"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
              />

              <Input
                label="Confirmer le mot de passe"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
              />

              {newPassword && confirmPassword && (
                <div className="text-sm">
                  {newPassword === confirmPassword ? (
                    <p className="text-green-600">✓ Les mots de passe correspondent</p>
                  ) : (
                    <p className="text-red-600">✗ Les mots de passe ne correspondent pas</p>
                  )}
                </div>
              )}

              <Button type="submit" className="w-full" isLoading={isLoading}>
                Réinitialiser le mot de passe
              </Button>

              <div className="flex justify-between text-sm">
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="text-gray-600 hover:text-gray-700"
                >
                  ← Changer l'email
                </button>
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-blue-600 hover:text-blue-700"
                  disabled={isLoading}
                >
                  Renvoyer le code
                </button>
              </div>
            </form>
          )}
        </Card>

        {/* Progress Indicator */}
        <div className="flex justify-center items-center space-x-2">
          <div
            className={`w-8 h-2 rounded-full ${
              step === 'email' ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          />
          <div
            className={`w-8 h-2 rounded-full ${
              step === 'reset' ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          />
        </div>
      </div>
    </div>
  );
}