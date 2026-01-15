'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { FiMenu, FiX, FiUser, FiHeart, FiBarChart2, FiLogOut, FiSettings, FiSearch, FiGlobe, FiChevronDown } from 'react-icons/fi';
import { useAuthStore } from '@/store/authStore';
import { useFavoritesStore } from '@/store/favoritesStore';
import { useComparisonStore } from '@/store/comparisonStore';
import gsap from 'gsap';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  const { user, logout } = useAuthStore();
  const { favorites } = useFavoritesStore();
  const { comparisonIds } = useComparisonStore();

  useEffect(() => {
    setMounted(true);

    // GSAP animation on mount
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      logoRef.current,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.6 }
    )
      .fromTo(
        navRef.current?.children || [],
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
        '-=0.3'
      )
      .fromTo(
        actionsRef.current,
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.6 },
        '-=0.4'
      );

    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled(scrolled);

      if (headerRef.current) {
        gsap.to(headerRef.current, {
          boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.1)' : 'none',
          backgroundColor: scrolled ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,1)',
          duration: 0.3,
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get values safely for SSR
  const favCount = mounted ? favorites.length : 0;
  const compareCount = mounted ? comparisonIds.length : 0;
  const currentUser = mounted ? user : null;

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/about', label: 'À propos' },
    { href: '/properties', label: 'Propriétés' },
    { href: '/properties?listingType=LOCATION', label: 'Locations' },
    { href: '/properties?listingType=VENTE', label: 'Ventes' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ];

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300"
    >
      {/* Top Bar */}
      <div className="hidden lg:block bg-primary-900 text-white text-xs">
        <div className="container mx-auto px-6 py-2 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span>📍 Saidia Bay, Morocco</span>
            <span>📞 +212 XXX XXX XXX</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 hover:text-accent-400 transition-colors">
              <FiGlobe className="w-3 h-3" />
              <span>EN</span>
              <FiChevronDown className="w-3 h-3" />
            </button>
            <span className="text-primary-400">|</span>
            <span>Mon - Sat: 9:00 AM - 7:00 PM</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div ref={logoRef} className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-10 h-10 bg-gradient-to-br from-primary-900 to-primary-700 rounded-xl flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
                <span className="text-white font-display font-bold text-xl">S</span>
                <div className="absolute inset-0 bg-accent-500 opacity-0 group-hover:opacity-20 transition-opacity" />
              </div>
              <div className="hidden sm:block">
                <span className="font-display font-bold text-xl text-primary-900">Saidia</span>
                <span className="font-display font-bold text-xl text-accent-600">Bay</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav ref={navRef} className="hidden lg:flex items-center gap-1">
            {navLinks.map((link, index) => (
              <Link
                key={link.href + index}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-secondary-700 hover:text-primary-900 transition-colors group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-accent-500 group-hover:w-4/5 transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div ref={actionsRef} className="flex items-center gap-2 lg:gap-4">
            {/* Search Button - Desktop */}
            <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-secondary-100 hover:bg-secondary-200 rounded-full transition-colors">
              <FiSearch className="w-4 h-4 text-secondary-600" />
              <span className="text-sm text-secondary-600">Rechercher...</span>
            </button>

            {/* Favorites */}
            <Link
              href="/favorites"
              className="relative p-2.5 hover:bg-secondary-100 rounded-full transition-colors"
              title="Favoris"
            >
              <FiHeart className="w-5 h-5 text-secondary-700" />
              {favCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center font-medium animate-pulse">
                  {favCount}
                </span>
              )}
            </Link>

            {/* Comparison */}
            {compareCount > 0 && (
              <Link
                href="/compare"
                className="relative p-2.5 hover:bg-secondary-100 rounded-full transition-colors"
                title="Comparer"
              >
                <FiBarChart2 className="w-5 h-5 text-secondary-700" />
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary-900 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {compareCount}
                </span>
              </Link>
            )}

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 pl-3 bg-secondary-100 hover:bg-secondary-200 rounded-full transition-all duration-200"
              >
                <span className="hidden sm:block text-sm font-medium text-secondary-700">
                  {currentUser ? currentUser.name.split(' ')[0] : 'Compte'}
                </span>
                <div className="w-8 h-8 bg-gradient-to-br from-primary-900 to-primary-700 rounded-full flex items-center justify-center">
                  <FiUser size={16} className="text-white" />
                </div>
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-luxury border border-secondary-100 py-2 z-50 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-transparent h-20 pointer-events-none" />
                  {currentUser ? (
                    <>
                      <div className="px-4 py-3 border-b border-secondary-100 relative">
                        <p className="font-semibold text-secondary-900">{currentUser.name}</p>
                        <p className="text-sm text-secondary-500">{currentUser.email}</p>
                      </div>
                      <div className="py-2">
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FiUser className="w-4 h-4 text-secondary-500" />
                          <span className="text-secondary-700">Tableau de bord</span>
                        </Link>
                        <Link
                          href="/favorites"
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FiHeart className="w-4 h-4 text-secondary-500" />
                          <span className="text-secondary-700">Favoris ({favCount})</span>
                        </Link>
                        {currentUser.role === 'admin' && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary-50 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <FiSettings className="w-4 h-4 text-secondary-500" />
                            <span className="text-secondary-700">Panneau Admin</span>
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
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <span className="text-secondary-700">Connexion</span>
                      </Link>
                      <Link
                        href="/register"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <span className="text-secondary-700">Inscription</span>
                      </Link>
                      <div className="border-t border-secondary-100 mt-2 pt-2">
                        <Link
                          href="/favorites"
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FiHeart className="w-4 h-4 text-secondary-500" />
                          <span className="text-secondary-700">Favoris ({favCount})</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2.5 hover:bg-secondary-100 rounded-full transition-colors"
            >
              {isMenuOpen ? (
                <FiX className="w-6 h-6 text-secondary-700" />
              ) : (
                <FiMenu className="w-6 h-6 text-secondary-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-white border-t border-secondary-100 shadow-lg transition-all duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-1">
            {navLinks.map((link, index) => (
              <Link
                key={link.href + index}
                href={link.href}
                className="px-4 py-3 text-sm font-medium text-secondary-700 hover:text-primary-900 hover:bg-secondary-50 rounded-xl transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-secondary-100">
            <Link
              href="/properties"
              className="block w-full py-3 text-center bg-primary-900 text-white rounded-xl font-medium hover:bg-primary-800 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Parcourir les Propriétés
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
