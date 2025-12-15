'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FiMenu, FiX, FiPhone, FiMail } from 'react-icons/fi';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/properties', label: 'Properties' },
    { href: '/properties?type=rent', label: 'For Rent' },
    { href: '/properties?type=sale', label: 'For Sale' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-primary-600 text-white py-2">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <a href="tel:+212600000000" className="flex items-center gap-1 hover:text-primary-100">
              <FiPhone size={14} />
              <span>+212 6 00 00 00 00</span>
            </a>
            <a href="mailto:contact@saidiabay.com" className="hidden sm:flex items-center gap-1 hover:text-primary-100">
              <FiMail size={14} />
              <span>contact@saidiabay.com</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-primary-100">
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="container mx-auto py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="font-heading font-bold text-xl text-secondary-800">
              Saidia<span className="text-primary-600">Bay</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-secondary-600 hover:text-primary-600 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Link href="/contact" className="btn-primary">
              Get in Touch
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 text-secondary-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-secondary-100">
            <div className="flex flex-col gap-4 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-secondary-600 hover:text-primary-600 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                className="btn-primary w-full text-center mt-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Get in Touch
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
