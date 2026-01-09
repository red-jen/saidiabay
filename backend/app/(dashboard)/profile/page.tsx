'use client';
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { api } from '@/lib/utils/api';

interface UserProfile {
  id: string;
  email: string;
  username: string | null;
  name: string;
  role: string;
}

type ChangeType = 'email' | 'password' | null;

export default function AdminProfilePage() {
  const { showToast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [changeType, setChangeType] = useState<ChangeType>(null);
  const [showOTPInput, setShowOTPInput] = useState(false);
  
  // Form data
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response: any = await api.get('/api/auth/profile');
      setProfile(response.data);
    } catch (error) {
      showToast('Erreur de chargement du profil', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newEmail) {
      showToast('Veuillez entrer un nouvel email', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post('/api/auth/profile/request-email-change', { newEmail });
      showToast('Code de confirmation envoyé à votre nouvel email', 'success');
      setShowOTPInput(true);
    } catch (error: any) {
      showToast(error.message || 'Erreur lors de la demande', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyEmailChange = async () => {
    if (!otpCode || otpCode.length !== 6) {
      showToast('Veuillez entrer le code à 6 chiffres', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post('/api/auth/profile/confirm-email-change', {
        newEmail,
        otpCode,
      });

      showToast('Email modifié avec succès', 'success');
      setChangeType(null);
      setShowOTPInput(false);
      setNewEmail('');
      setOtpCode('');
      loadProfile();
    } catch (error: any) {
      showToast(error.message || 'Code invalide ou expiré', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showToast('Les mots de passe ne correspondent pas', 'error');
      return;
    }

    if (newPassword.length < 6) {
      showToast('Le mot de passe doit contenir au moins 6 caractères', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post('/api/auth/profile/change-password', {
        currentPassword,
        newPassword,
      });

      showToast('Mot de passe modifié avec succès', 'success');
      setChangeType(null);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      showToast(error.message || 'Mot de passe actuel incorrect', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelChange = () => {
    setChangeType(null);
    setShowOTPInput(false);
    setNewEmail('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setOtpCode('');
  };

  if (isLoading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  if (!profile) {
    return <div className="text-center py-12">Profil non trouvé</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>

      {/* Profile Info */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Informations du compte</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Nom:</span>
            <span className="font-medium">{profile.name}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Email:</span>
            <span className="font-medium">{profile.email}</span>
          </div>
          {profile.username && (
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Nom d'utilisateur:</span>
              <span className="font-medium">{profile.username}</span>
            </div>
          )}
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Rôle:</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
              {profile.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur'}
            </span>
          </div>
        </div>
      </Card>

      {/* Change Email */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Changer l'email</h2>
        
        {changeType !== 'email' && !showOTPInput && (
          <Button onClick={() => setChangeType('email')}>
            Modifier mon email
          </Button>
        )}

        {changeType === 'email' && !showOTPInput && (
          <form onSubmit={handleChangeEmail} className="space-y-4">
            <Input
              label="Nouvel email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
              placeholder="nouveau@email.com"
            />

            <div className="flex gap-3">
              <Button type="submit" isLoading={isSubmitting}>
                Envoyer le code de confirmation
              </Button>
              <Button type="button" variant="ghost" onClick={cancelChange}>
                Annuler
              </Button>
            </div>
          </form>
        )}

        {changeType === 'email' && showOTPInput && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                📧 Code envoyé à: <strong>{newEmail}</strong>
              </p>
            </div>

            <Input
              label="Code de confirmation"
              type="text"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              maxLength={6}
              placeholder="123456"
            />

            <div className="flex gap-3">
              <Button onClick={handleVerifyEmailChange} isLoading={isSubmitting}>
                Vérifier et changer l'email
              </Button>
              <Button variant="ghost" onClick={cancelChange}>
                Annuler
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Change Password */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">Changer le mot de passe</h2>
        
        {changeType !== 'password' && (
          <Button onClick={() => setChangeType('password')}>
            Modifier mon mot de passe
          </Button>
        )}

        {changeType === 'password' && (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <Input
              label="Mot de passe actuel"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              placeholder="••••••••"
            />

            <Input
              label="Nouveau mot de passe"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
            />

            <Input
              label="Confirmer le nouveau mot de passe"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
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

            <div className="flex gap-3">
              <Button type="submit" isLoading={isSubmitting}>
                Changer le mot de passe
              </Button>
              <Button type="button" variant="ghost" onClick={cancelChange}>
                Annuler
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}