'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { logout, getUser, User } from '@/lib/auth/session';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Welcome back!</h2>
          {user && <p className="text-sm text-gray-600">{user.email}</p>}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            {user && (
              <>
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 uppercase">{user.role}</p>
              </>
            )}
          </div>
          <Button variant="ghost" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};