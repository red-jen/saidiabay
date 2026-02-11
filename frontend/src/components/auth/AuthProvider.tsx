'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/lib/api';

/**
 * AuthProvider — verifies the session cookie is still valid on app load.
 * If the session is expired/invalid, it clears the local auth store.
 * This runs once on mount (client-side only).
 */
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, setUser, logout, setLoading } = useAuthStore();

  useEffect(() => {
    const verifySession = async () => {
      // If user thinks they're logged in (from persisted localStorage), verify with backend
      if (isAuthenticated) {
        try {
          const response = await authApi.getMe();
          const user = response.data?.data || response.data;
          if (user && user.id) {
            // Session is valid — update user data in store
            const normalizedRole =
              user.role === 'ADMIN' || user.role === 'admin' ? 'admin' : 'client';
            setUser({
              id: user.id,
              name: user.name,
              email: user.email,
              phone: user.phone,
              role: normalizedRole as 'admin' | 'client',
            });
          } else {
            // Invalid response — clear store
            logout();
          }
        } catch {
          // Session expired or invalid — clear store silently
          logout();
          localStorage.removeItem('auth-storage');
        }
      }
      setLoading(false);
    };

    verifySession();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>;
}

