'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ToastProvider } from '@/components/ui/Toast';
import { isAuthenticated, setUser } from '@/lib/auth/session';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Fast path: localStorage already has user data (e.g. logged in from backend login)
      if (isAuthenticated()) {
        setAuthorized(true);
        setAuthChecked(true);
        return;
      }

      // Slow path: user might have logged in from the frontend (port 3001)
      // where localStorage was set on port 3001, not port 3000.
      // The session cookie IS shared across ports, so verify it via the API.
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/auth/profile`,
          {
            method: 'GET',
            credentials: 'include', // Send the session cookie
          }
        );

        if (response.ok) {
          const result = await response.json();
          const user = result.data || result;

          if (user && user.id && (user.role === 'ADMIN' || user.role === 'admin')) {
            // Valid admin session — save to localStorage so subsequent checks are fast
            setUser({
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            });
            setAuthorized(true);
            setAuthChecked(true);
            return;
          }
        }
      } catch (error) {
        console.error('Session verification failed:', error);
      }

      // No valid session — redirect to login
      setAuthChecked(true);
      router.push('/login');
    };

    checkAuth();
  }, [router]);

  // Show a loading state while verifying auth
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Vérification de la session...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return null; // Will redirect via router.push above
  }

  return (
    <ToastProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </ToastProvider>
  );
}