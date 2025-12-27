'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FiMenu, FiX, FiUser, FiHeart, FiBarChart2, FiLogOut, FiSettings } from 'react-icons/fi';
import { useAuthStore } from '@/store/authStore';
import { useFavoritesStore } from '@/store/favoritesStore';
import { useComparisonStore } from '@/store/comparisonStore';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, logout } = useAuthStore();
  const { favorites } = useFavoritesStore();
  const { comparisonIds } = useComparisonStore();

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get values safely for SSR
  const favCount = mounted ? favorites.length : 0;
  const compareCount = mounted ? comparisonIds.length : 0;
  const currentUser = mounted ? user : null;

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/properties', label: 'Properties' },
    { href: '/blog', label: 'Blog' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-sm' : 'bg-white'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-accent-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-display font-bold text-lg">S</span>
            </div>
            <span className="font-display font-semibold text-xl text-secondary-900">
              saidiabay
            </span>
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-secondary-700 hover:text-secondary-900 hover:bg-secondary-50 rounded-full transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Favorites */}
            <Link
              href="/favorites"
              className="relative p-2 hover:bg-secondary-50 rounded-full transition-colors hidden md:block"
              title="Favorites"
            >
              <FiHeart className="w-5 h-5 text-secondary-700" />
              {favCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center">
                  {favCount}
                </span>
              )}
            </Link>

            {/* Comparison */}
            {compareCount > 0 && (
              <Link
                href="/compare"
                className="relative p-2 hover:bg-secondary-50 rounded-full transition-colors hidden md:block"
                title="Compare"
              >
                <FiBarChart2 className="w-5 h-5 text-secondary-700" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-900 text-white text-xs rounded-full flex items-center justify-center">
                  {compareCount}
                </span>
              </Link>
            )}

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-3 p-1.5 pl-3 border border-secondary-200 rounded-full hover:shadow-md transition-shadow"
              >
                <FiMenu size={16} className="text-secondary-700 lg:hidden" />
                <div className="w-8 h-8 bg-primary-900 rounded-full flex items-center justify-center">
                  <FiUser size={16} className="text-white" />
                </div>
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-luxury border border-secondary-200 py-2 z-50">
                  {currentUser ? (
                    <>
                      <div className="px-4 py-3 border-b border-secondary-200">
                        <p className="font-semibold text-secondary-900">{currentUser.name}</p>
                        <p className="text-sm text-secondary-600">{currentUser.email}</p>
                      </div>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FiUser className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <Link
                        href="/favorites"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FiHeart className="w-4 h-4" />
                        Favorites ({favCount})
                      </Link>
                      {compareCount > 0 && (
                        <Link
                          href="/compare"
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FiBarChart2 className="w-4 h-4" />
                          Compare ({compareCount})
                        </Link>
                      )}
                      {currentUser.role === 'admin' && (
                        <>
                          <div className="border-t border-secondary-200 my-2" />
                          <Link
                            href="/admin"
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary-50 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <FiSettings className="w-4 h-4" />
                            Admin Panel
                          </Link>
                        </>
                      )}
                      <div className="border-t border-secondary-200 my-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-secondary-50 transition-colors text-left"
                      >
                        <FiLogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="block px-4 py-2.5 hover:bg-secondary-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Log in
                      </Link>
                      <Link
                        href="/register"
                        className="block px-4 py-2.5 hover:bg-secondary-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Sign up
                      </Link>
                      <div className="border-t border-secondary-200 my-2" />
                      <Link
                        href="/favorites"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FiHeart className="w-4 h-4" />
                        Favorites ({favCount})
                      </Link>
                      {compareCount > 0 && (
                        <Link
                          href="/compare"
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FiBarChart2 className="w-4 h-4" />
                          Compare ({compareCount})
                        </Link>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-secondary-100 py-4">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 text-sm font-medium text-secondary-700 hover:bg-secondary-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-secondary-100 my-2" />
              <Link
                href="/login"
                className="px-4 py-3 text-sm font-medium text-secondary-700 hover:bg-secondary-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="px-4 py-3 text-sm font-medium text-secondary-700 hover:bg-secondary-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign up
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
