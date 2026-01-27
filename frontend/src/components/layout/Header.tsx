'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { FiMenu, FiX, FiUser, FiHeart, FiBarChart2, FiLogOut, FiSettings, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import { useAuthStore } from '@/store/authStore';
import { useFavoritesStore } from '@/store/favoritesStore';
import { useComparisonStore } from '@/store/comparisonStore';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

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

  const favCount = mounted ? favorites.length : 0;
  const compareCount = mounted ? comparisonIds.length : 0;
  const currentUser = mounted ? user : null;

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/properties', label: 'Propriétés' },
    { href: '/properties?listingType=LOCATION', label: 'Locations' },
    { href: '/properties?listingType=VENTE', label: 'Acheter' },
    { href: '/about', label: 'À Propos' },
    { href: '/contact', label: 'Contact' },
  ];

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  return (
    <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50">
      {/* Top Bar - Premium Contact Info */}
      <div className={`hidden lg:block transition-all duration-500 ${isScrolled ? 'h-0 opacity-0 overflow-hidden' : 'h-auto opacity-100'}`}>
        <div className="bg-primary-900 text-white/90">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between h-10 text-xs">
              <div className="flex items-center divide-x divide-white/20">
                <div className="flex items-center gap-2 pr-4">
                  <FiMapPin className="w-3.5 h-3.5 text-accent-400" />
                  <span>Saidia Bay, Morocco</span>
                </div>
                <div className="flex items-center gap-2 px-4">
                  <FiPhone className="w-3.5 h-3.5 text-accent-400" />
                  <span>+212 XXX XXX XXX</span>
                </div>
                <div className="flex items-center gap-2 pl-4">
                  <FiMail className="w-3.5 h-3.5 text-accent-400" />
                  <span>contact@saidiabay.com</span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-white/60">Lun - Sam: 9h00 - 19h00</span>
                <div className="flex items-center gap-3">
                  <button className="hover:text-accent-400 transition-colors">FR</button>
                  <span className="text-white/30">|</span>
                  <button className="hover:text-accent-400 transition-colors">EN</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className={`transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-elegant-md' 
          : 'bg-white/95 backdrop-blur-md'
      }`}>
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo - Premium Brand Identity */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                {/* Logo Mark */}
                <div className="w-12 h-12 bg-primary-900 rounded-lg flex items-center justify-center group-hover:bg-primary-800 transition-colors">
                  <span className="font-serif text-2xl text-white font-medium">S</span>
                </div>
                {/* Gold accent */}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent-500 rounded-sm" />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="font-serif text-2xl font-medium text-primary-900 leading-tight tracking-tight">
                  Saidia Bay
                </span>
                <span className="text-[10px] tracking-[0.3em] uppercase text-accent-600 font-medium">
                  Real Estate
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href + index}
                  href={link.href}
                  className="relative px-5 py-2 text-sm font-medium text-primary-800 hover:text-primary-900 transition-colors group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-accent-500 group-hover:w-8 transition-all duration-300" />
                </Link>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Favorites */}
              <Link
                href="/favorites"
                className="relative p-2.5 text-primary-700 hover:text-primary-900 hover:bg-secondary-100 rounded-full transition-all"
                title="Favoris"
              >
                <FiHeart className="w-5 h-5" />
                {favCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-accent-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                    {favCount}
                  </span>
                )}
              </Link>

              {/* Comparison */}
              {compareCount > 0 && (
                <Link
                  href="/compare"
                  className="relative p-2.5 text-primary-700 hover:text-primary-900 hover:bg-secondary-100 rounded-full transition-all"
                  title="Comparer"
                >
                  <FiBarChart2 className="w-5 h-5" />
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary-900 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                    {compareCount}
                  </span>
                </Link>
              )}

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 text-primary-700 hover:text-primary-900 hover:bg-secondary-100 rounded-full transition-all"
                >
                  <div className="w-8 h-8 bg-primary-900 rounded-full flex items-center justify-center">
                    <FiUser size={16} className="text-white" />
                  </div>
                  <span className="hidden md:block text-sm font-medium">
                    {currentUser ? currentUser.name.split(' ')[0] : 'Compte'}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-elegant-lg border border-secondary-200 py-2 z-50 overflow-hidden">
                    {currentUser ? (
                      <>
                        <div className="px-4 py-3 border-b border-secondary-100 bg-secondary-50">
                          <p className="font-semibold text-primary-900">{currentUser.name}</p>
                          <p className="text-sm text-secondary-600">{currentUser.email}</p>
                        </div>
                        <div className="py-2">
                          <Link
                            href="/dashboard"
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary-50 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <FiUser className="w-4 h-4 text-secondary-500" />
                            <span className="text-primary-800">Tableau de bord</span>
                          </Link>
                          <Link
                            href="/favorites"
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary-50 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <FiHeart className="w-4 h-4 text-secondary-500" />
                            <span className="text-primary-800">Mes Favoris ({favCount})</span>
                          </Link>
                          {currentUser.role === 'admin' && (
                            <Link
                              href="/admin"
                              className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary-50 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <FiSettings className="w-4 h-4 text-secondary-500" />
                              <span className="text-primary-800">Administration</span>
                            </Link>
                          )}
                        </div>
                        <div className="border-t border-secondary-100 pt-2">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-danger-50 transition-colors text-left"
                          >
                            <FiLogOut className="w-4 h-4 text-danger-500" />
                            <span className="text-danger-600">Déconnexion</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="py-2">
                        <Link
                          href="/login"
                          className="block px-4 py-2.5 hover:bg-secondary-50 transition-colors text-primary-800"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Connexion
                        </Link>
                        <Link
                          href="/register"
                          className="block px-4 py-2.5 hover:bg-secondary-50 transition-colors text-primary-800"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Créer un compte
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* CTA Button - Desktop */}
              <Link
                href="/properties"
                className="hidden lg:flex items-center gap-2 px-6 py-2.5 bg-primary-900 text-white text-sm font-medium rounded-lg hover:bg-primary-800 transition-all"
              >
                Voir les biens
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2.5 text-primary-700 hover:bg-secondary-100 rounded-full transition-colors"
              >
                {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`lg:hidden fixed inset-0 top-20 bg-white z-40 transition-all duration-300 ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="container mx-auto px-4 py-6">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link, index) => (
              <Link
                key={link.href + index}
                href={link.href}
                className="px-4 py-4 text-lg font-medium text-primary-800 hover:text-primary-900 hover:bg-secondary-50 rounded-xl transition-colors border-b border-secondary-100"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-6 pt-6 border-t border-secondary-200 space-y-3">
            {!currentUser && (
              <>
                <Link
                  href="/login"
                  className="block w-full py-3.5 text-center border-2 border-primary-900 text-primary-900 rounded-xl font-medium hover:bg-primary-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="block w-full py-3.5 text-center bg-primary-900 text-white rounded-xl font-medium hover:bg-primary-800 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Créer un compte
                </Link>
              </>
            )}
          </div>

          {/* Contact Info Mobile */}
          <div className="mt-8 pt-6 border-t border-secondary-200">
            <p className="text-sm text-secondary-600 mb-4">Contactez-nous</p>
            <div className="space-y-3 text-primary-800">
              <a href="tel:+212XXXXXXX" className="flex items-center gap-3">
                <FiPhone className="w-4 h-4 text-accent-500" />
                <span>+212 XXX XXX XXX</span>
              </a>
              <a href="mailto:contact@saidiabay.com" className="flex items-center gap-3">
                <FiMail className="w-4 h-4 text-accent-500" />
                <span>contact@saidiabay.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 z-30"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
