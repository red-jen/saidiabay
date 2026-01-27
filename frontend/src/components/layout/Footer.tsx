'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiFacebook, FiInstagram, FiLinkedin, FiMail, FiPhone, FiMapPin, FiArrowUp, FiArrowRight } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Merci pour votre inscription!');
    setEmail('');
  };

  const footerLinks = {
    properties: [
      { label: 'Toutes les Propriétés', href: '/properties' },
      { label: 'Villas de Luxe', href: '/properties?propertyCategory=VILLA' },
      { label: 'Appartements', href: '/properties?propertyCategory=APPARTEMENT' },
      { label: 'Locations', href: '/properties?listingType=LOCATION' },
      { label: 'Acheter', href: '/properties?listingType=VENTE' },
    ],
    company: [
      { label: 'À Propos', href: '/about' },
      { label: 'Notre Équipe', href: '/about#team' },
      { label: 'Blog', href: '/blog' },
      { label: 'Carrières', href: '/contact' },
    ],
    support: [
      { label: 'Contact', href: '/contact' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Politique de Confidentialité', href: '/privacy' },
      { label: 'Conditions d\'Utilisation', href: '/terms' },
    ],
  };

  const socialLinks = [
    { icon: FiFacebook, href: '#', label: 'Facebook' },
    { icon: FiInstagram, href: '#', label: 'Instagram' },
    { icon: FiLinkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-primary-900 text-white relative">
      {/* Top CTA Section */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 lg:px-6 py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="font-serif text-2xl md:text-3xl mb-2">
                Prêt à trouver votre propriété idéale ?
              </h3>
              <p className="text-white/70">
                Notre équipe d'experts est à votre disposition pour vous accompagner
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent-500 text-white font-medium rounded-lg hover:bg-accent-600 transition-colors"
              >
                Voir les Propriétés
                <FiArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-white/30 text-white font-medium rounded-lg hover:bg-white/10 hover:border-white/50 transition-colors"
              >
                Nous Contacter
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 lg:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                  <span className="font-serif text-2xl text-primary-900 font-medium">S</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent-500 rounded-sm" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl text-white leading-tight tracking-tight">
                  Saidia Bay
                </span>
                <span className="text-[10px] tracking-[0.3em] uppercase text-accent-400 font-medium">
                  Real Estate
                </span>
              </div>
            </Link>
            
            <p className="text-white/70 mb-8 max-w-sm leading-relaxed">
              Votre partenaire de confiance pour l'immobilier de prestige à Saidia Bay, 
              la perle de la Méditerranée marocaine.
            </p>

            {/* Contact Info */}
            <div className="space-y-4 mb-8">
              <a href="tel:+212XXXXXXXX" className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-accent-500/20 transition-colors">
                  <FiPhone className="w-4 h-4 text-accent-400" />
                </div>
                <span>+212 XXX XXX XXX</span>
              </a>
              <a href="mailto:contact@saidiabay.com" className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-accent-500/20 transition-colors">
                  <FiMail className="w-4 h-4 text-accent-400" />
                </div>
                <span>contact@saidiabay.com</span>
              </a>
              <div className="flex items-center gap-3 text-white/80">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <FiMapPin className="w-4 h-4 text-accent-400" />
                </div>
                <span>Saidia Bay, Morocco</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-white/20 rounded-lg flex items-center justify-center hover:bg-accent-500 hover:border-accent-500 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Properties Links */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold tracking-[0.15em] uppercase text-white mb-6">
              Propriétés
            </h4>
            <ul className="space-y-3">
              {footerLinks.properties.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-accent-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold tracking-[0.15em] uppercase text-white mb-6">
              Entreprise
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-accent-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold tracking-[0.15em] uppercase text-white mb-6">
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-accent-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold tracking-[0.15em] uppercase text-white mb-6">
              Newsletter
            </h4>
            <p className="text-white/70 mb-4 text-sm">
              Recevez nos dernières offres et actualités immobilières.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre email"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-accent-500 transition-colors text-sm"
              />
              <button
                type="submit"
                className="w-full py-3 bg-accent-500 text-white font-medium rounded-lg hover:bg-accent-600 transition-colors text-sm"
              >
                S'inscrire
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 lg:px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/50 text-sm">
              © {currentYear} Saidia Bay Real Estate. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6 text-sm text-white/50">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Confidentialité
              </Link>
              <span className="text-white/20">|</span>
              <Link href="/terms" className="hover:text-white transition-colors">
                Conditions
              </Link>
              <span className="text-white/20">|</span>
              <span>Conception par SaidiaBay</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-primary-900 border border-accent-500/30 text-white rounded-full shadow-elegant-lg flex items-center justify-center hover:bg-accent-500 hover:border-accent-500 transition-all z-40"
        aria-label="Scroll to top"
      >
        <FiArrowUp className="w-5 h-5" />
      </button>
    </footer>
  );
};

export default Footer;
