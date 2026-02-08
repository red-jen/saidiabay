'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
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
  phone: string | null;
  role: string;
}

type ChangeType = 'email' | 'password' | 'phone' | null;

export default function UserProfilePage() {
  const { showToast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [changeType, setChangeType] = useState<ChangeType>(null);
  const [showOTPInput, setShowOTPInput] = useState(false);

  // Password visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form data
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
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
    if (!newEmail) return;

    setIsSubmitting(true);
    try {
      await api.post('/api/auth/profile/request-email-change', { newEmail });
      showToast('Code envoyé à votre nouvel email', 'success');
      setShowOTPInput(true);
    } catch (error: any) {
      showToast(error.message || 'Erreur lors de la demande', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyEmailChange = async () => {
    if (!otpCode || otpCode.length !== 6) {
      showToast('Code invalide', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/api/auth/profile/confirm-email-change', { 
        newEmail, 
        otpCode 
      });
      showToast('Email modifié avec succès', 'success');
      resetForm();
      loadProfile();
    } catch (error: any) {
      showToast(error.message || 'Code invalide', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhone) return;

    setIsSubmitting(true);
    try {
      await api.post('/api/auth/profile/request-phone-change', { newPhone });
      showToast('Code envoyé à votre email', 'success');
      setShowOTPInput(true);
    } catch (error: any) {
      showToast(error.message || 'Erreur lors de la demande', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyPhoneChange = async () => {
    if (!otpCode || otpCode.length !== 6) {
      showToast('Code invalide', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/api/auth/profile/confirm-phone-change', { 
        newPhone, 
        otpCode 
      });
      showToast('Téléphone modifié avec succès', 'success');
      resetForm();
      loadProfile();
    } catch (error: any) {
      showToast(error.message || 'Code invalide', 'error');
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
        newPassword 
      });
      showToast('Mot de passe modifié avec succès', 'success');
      resetForm();
    } catch (error: any) {
      showToast(error.message || 'Mot de passe incorrect', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setChangeType(null);
    setShowOTPInput(false);
    setNewEmail('');
    setNewPhone('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setOtpCode('');
  };

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
      // Clear local storage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      // Redirect to home
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails on server, clear local data and redirect
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/';
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  if (!profile) {
    return <div className="text-center py-12">Profil non trouvé</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>
            <div className="flex gap-3">
              <Link href="/user/reservations">
                <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  Mes Réservations
                </button>
              </Link>
              <Link href="/">
                <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  Accueil
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Profile Info */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Nom complet:</span>
              <span className="font-medium">{profile.name}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{profile.email}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Téléphone:</span>
              <span className="font-medium">{profile.phone || 'Non renseigné'}</span>
            </div>
            {profile.username && (
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Nom d'utilisateur:</span>
                <span className="font-medium">{profile.username}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Change Email */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Changer l'email</h2>
          
          {changeType !== 'email' && (
            <Button onClick={() => setChangeType('email')}>Modifier mon email</Button>
          )}

          {changeType === 'email' && !showOTPInput && (
            <form onSubmit={handleChangeEmail} className="space-y-4">
              <Input
                label="Nouvel email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />
              <div className="flex gap-3">
                <Button type="submit" isLoading={isSubmitting}>
                  Envoyer le code
                </Button>
                <Button type="button" variant="ghost" onClick={resetForm}>
                  Annuler
                </Button>
              </div>
            </form>
          )}

          {changeType === 'email' && showOTPInput && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">📧 Code envoyé à: <strong>{newEmail}</strong></p>
              </div>
              <Input
                label="Code de confirmation"
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                maxLength={6}
              />
              <div className="flex gap-3">
                <Button onClick={handleVerifyEmailChange} isLoading={isSubmitting}>
                  Vérifier
                </Button>
                <Button variant="ghost" onClick={resetForm}>
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Change Phone */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Changer le téléphone</h2>
          
          {changeType !== 'phone' && (
            <Button onClick={() => setChangeType('phone')}>Modifier mon téléphone</Button>
          )}

          {changeType === 'phone' && !showOTPInput && (
            <form onSubmit={handleChangePhone} className="space-y-4">
              <Input
                label="Nouveau téléphone"
                type="tel"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                required
                placeholder="0612345678"
              />
              <div className="flex gap-3">
                <Button type="submit" isLoading={isSubmitting}>
                  Envoyer le code
                </Button>
                <Button type="button" variant="ghost" onClick={resetForm}>
                  Annuler
                </Button>
              </div>
            </form>
          )}

          {changeType === 'phone' && showOTPInput && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">📧 Code envoyé à votre email</p>
              </div>
              <Input
                label="Code de confirmation"
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                maxLength={6}
              />
              <div className="flex gap-3">
                <Button onClick={handleVerifyPhoneChange} isLoading={isSubmitting}>
                  Vérifier
                </Button>
                <Button variant="ghost" onClick={resetForm}>
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
            <Button onClick={() => setChangeType('password')}>Modifier mon mot de passe</Button>
          )}

          {changeType === 'password' && (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="relative">
                <Input
                  label="Mot de passe actuel"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showCurrentPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showCurrentPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="relative">
                <Input
                  label="Nouveau mot de passe"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showNewPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showNewPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="relative">
                <Input
                  label="Confirmer le mot de passe"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {newPassword && confirmPassword && (
                <p className={`text-sm ${newPassword === confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                  {newPassword === confirmPassword ? '✓ Correspond' : '✗ Ne correspond pas'}
                </p>
              )}
              <div className="flex gap-3">
                <Button type="submit" isLoading={isSubmitting}>
                  Changer le mot de passe
                </Button>
                <Button type="button" variant="ghost" onClick={resetForm}>
                  Annuler
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}