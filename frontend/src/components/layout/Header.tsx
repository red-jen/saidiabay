'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { FiMenu, FiX, FiUser, FiHeart, FiBarChart2, FiLogOut, FiSettings, FiPhone, FiMail, FiMapPin, FiSearch, FiHome, FiChevronDown, FiCalendar } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuthStore } from '@/store/authStore';
import { useFavoritesStore } from '@/store/favoritesStore';
import { useComparisonStore } from '@/store/comparisonStore';

const propertyTypes = [
  { id: 'all', label: 'Tous types' },
  { id: 'VILLA', label: 'Villas' },
  { id: 'APPARTEMENT', label: 'Appartements' },
];

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeType, setActiveType] = useState('all');
  const [searchParams, setSearchParams] = useState({
    location: '',
    listingType: 'LOCATION',
  });
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
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
  const isRental = searchParams.listingType === 'LOCATION';

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (searchParams.location.trim()) params.append('search', searchParams.location.trim());
    if (searchParams.listingType) params.append('listingType', searchParams.listingType);
    if (activeType !== 'all') params.append('propertyCategory', activeType);
    if (startDate && searchParams.listingType === 'LOCATION') {
      params.append('startDate', startDate.toISOString().split('T')[0]);
    }
    if (endDate && searchParams.listingType === 'LOCATION') {
      params.append('endDate', endDate.toISOString().split('T')[0]);
    }
    router.push(`/properties?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

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
    <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50 w-full max-w-full overflow-x-hidden">
      {/* Top Bar - Premium Contact Info */}
      <div className={`hidden lg:block transition-all duration-500 ${isScrolled ? 'h-0 opacity-0 overflow-hidden' : 'h-auto opacity-100'}`}>
        <div className="bg-primary-900 text-white/90 w-full">
          <div className="container mx-auto px-6 max-w-full">
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
      <div className={`transition-all duration-300 w-full ${
        isScrolled 
          ? 'bg-white shadow-elegant-md' 
          : 'bg-white/95 backdrop-blur-md'
      }`}>
      <div className="container mx-auto px-4 lg:px-6 max-w-full">
          <div className="flex items-center justify-between h-20 min-w-0">
            {/* Logo - Premium Brand Identity */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative flex-shrink-0">
                <Image
                  src="/images/Logo.png"
                  alt="Saidia Bay Real Estate"
                  width={98}
                  height={98}
                  className="object-contain"
                  priority
                />
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

      {/* Search Bar - Professional & Clean - Only on Home Page */}
      {isHomePage && (
        <div className="bg-white border-t border-secondary-100 w-full">
          <div className="container mx-auto px-4 lg:px-6 py-3 max-w-full">
            <div className="max-w-6xl mx-auto w-full">
              {/* Horizontal Search Bar - Clean Design */}
              <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-md border border-secondary-200 overflow-hidden w-full">
                <div className="flex flex-col lg:flex-row w-full min-w-0">
                  {/* Listing Type Toggle - Integrated */}
                  <div className="flex items-center gap-1 p-1 bg-secondary-50 border-r border-secondary-200 lg:w-32 flex-shrink-0">
                    <button
                      onClick={() => {
                        setSearchParams({ ...searchParams, listingType: 'LOCATION' });
                        setStartDate(null);
                        setEndDate(null);
                      }}
                      className={`flex-1 px-3 py-2 text-xs font-medium rounded transition-all ${
                        searchParams.listingType === 'LOCATION'
                          ? 'bg-white text-primary-900 shadow-sm'
                          : 'text-secondary-600 hover:text-primary-900'
                      }`}
                    >
                      Location
                    </button>
                    <button
                      onClick={() => {
                        setSearchParams({ ...searchParams, listingType: 'VENTE' });
                        setStartDate(null);
                        setEndDate(null);
                      }}
                      className={`flex-1 px-3 py-2 text-xs font-medium rounded transition-all ${
                        searchParams.listingType === 'VENTE'
                          ? 'bg-white text-primary-900 shadow-sm'
                          : 'text-secondary-600 hover:text-primary-900'
                      }`}
                    >
                      Achat
                    </button>
                  </div>

                  {/* Location */}
                  <div className="flex-1 relative border-r border-secondary-200 min-w-0">
                    <div className="flex items-center gap-3 px-4 py-3 hover:bg-secondary-50/50 transition-colors min-w-0">
                      <FiMapPin className="w-4 h-4 text-secondary-500 flex-shrink-0" />
                      <input
                        type="text"
                        placeholder="Où allez-vous ?"
                        value={searchParams.location}
                        onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                        onKeyPress={handleKeyPress}
                        className="flex-1 bg-transparent text-sm text-primary-900 placeholder:text-secondary-400 focus:outline-none min-w-0"
                      />
                    </div>
                  </div>

                  {/* Property Type */}
                  <div className="flex-1 relative border-r border-secondary-200 min-w-0">
                    <div className="flex items-center gap-3 px-4 py-3 hover:bg-secondary-50/50 transition-colors min-w-0">
                      <FiHome className="w-4 h-4 text-secondary-500 flex-shrink-0" />
                      <select
                        value={activeType}
                        onChange={(e) => setActiveType(e.target.value)}
                        className="flex-1 bg-transparent text-sm text-primary-900 focus:outline-none appearance-none cursor-pointer min-w-0"
                      >
                        {propertyTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      <FiChevronDown className="w-4 h-4 text-secondary-400 flex-shrink-0 pointer-events-none" />
                    </div>
                  </div>

                  {/* Date Range - Only for Rentals */}
                  {isRental && (
                    <div className="flex-1 relative border-r border-secondary-200 min-w-0">
                      <div className="flex items-center gap-2 px-4 py-3 hover:bg-secondary-50/50 transition-colors min-w-0">
                        <FiCalendar className="w-4 h-4 text-secondary-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0 relative">
                          <div className="absolute inset-0 pointer-events-none z-10 flex items-center">
                            {startDate && endDate ? (
                              <span className="text-sm text-primary-900 font-medium">
                                {startDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })} — {endDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                              </span>
                            ) : startDate ? (
                              <span className="text-sm text-primary-900 font-medium">
                                {startDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })} — ...
                              </span>
                            ) : (
                              <span className="text-sm text-secondary-400">Date d'arrivée — Date de départ</span>
                            )}
                          </div>
                          <DatePicker
                            selected={startDate}
                            onChange={(dates: Date | [Date | null, Date | null] | null) => {
                              if (dates) {
                                if (Array.isArray(dates)) {
                                  setStartDate(dates[0]);
                                  setEndDate(dates[1]);
                                } else {
                                  setStartDate(dates);
                                  setEndDate(null);
                                }
                              } else {
                                setStartDate(null);
                                setEndDate(null);
                              }
                            }}
                            startDate={startDate}
                            endDate={endDate}
                            selectsRange
                            minDate={new Date()}
                            dateFormat=""
                            className="w-full bg-transparent text-sm text-transparent focus:outline-none cursor-pointer border-0 p-0 opacity-0"
                            wrapperClassName="w-full"
                            calendarClassName="date-picker-calendar"
                            popperClassName="date-picker-popper"
                            isClearable
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Search Button */}
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 px-6 lg:px-8 py-3 bg-accent-500 text-white font-semibold hover:bg-accent-600 transition-all text-sm whitespace-nowrap flex-shrink-0 rounded-r-lg"
                  >
                    <FiSearch className="w-4 h-4" />
                    <span className="hidden sm:inline">Rechercher</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation */}
      <div
        className={`lg:hidden fixed inset-0 ${isHomePage ? 'top-[200px]' : 'top-[80px]'} bg-white z-40 transition-all duration-300 ${
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
