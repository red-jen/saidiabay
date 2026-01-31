'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiArrowUp, FiArrowRight } from 'react-icons/fi';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { MdOutlineEmail, MdOutlinePhone, MdOutlineLocationOn } from 'react-icons/md';

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
    { icon: FaFacebookF, href: '#', label: 'Facebook' },
    { icon: FaInstagram, href: '#', label: 'Instagram' },
    { icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="relative bg-primary-950 text-white overflow-hidden">
      {/* Premium Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-900 via-primary-950 to-primary-950" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-950/50 via-transparent to-primary-950/50" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-500/50 to-transparent" />
      
      {/* Top CTA Section */}
      <div className="relative border-b border-white/10">
        <div className="container mx-auto px-4 lg:px-6 py-16 lg:py-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              {/* Brand Label - Matching Hero */}
              <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
                <div className="w-12 h-px bg-accent-500" />
                <span className="text-accent-400 text-sm font-medium tracking-[0.2em] uppercase">
                  Commencez Votre Voyage
                </span>
              </div>
              <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium mb-3 leading-tight">
                Prêt à trouver votre <span className="text-accent-400">propriété idéale</span> ?
              </h3>
              <p className="text-white/80 text-lg leading-relaxed max-w-xl">
                Notre équipe d'experts est à votre disposition pour vous accompagner
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/properties"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-accent-500 text-white font-medium rounded-lg hover:bg-accent-600 transition-all shadow-gold"
              >
                Voir les Propriétés
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-medium rounded-lg hover:bg-white/10 hover:border-white/50 transition-all"
              >
                Nous Contacter
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="relative container mx-auto px-4 lg:px-6 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-3 mb-8 group">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center shadow-gold group-hover:scale-110 transition-transform">
                  <span className="font-serif text-2xl text-white font-medium">S</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary-900 rounded-sm border-2 border-accent-500" />
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
            
            <p className="text-white/80 mb-10 max-w-sm leading-relaxed text-base">
              Votre partenaire de confiance pour l'immobilier de prestige à Saidia Bay, 
              la perle de la Méditerranée marocaine.
            </p>

            {/* Contact Info - Luxury Icons */}
            <div className="space-y-5 mb-10">
              <a href="tel:+212XXXXXXXX" className="flex items-center gap-4 text-white/80 hover:text-white transition-colors group">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-accent-500/20 group-hover:border-accent-500/50 border border-white/10 transition-all duration-300 shadow-elegant">
                  <HiOutlinePhone className="w-5 h-5 text-accent-400" />
                </div>
                <span className="font-medium">+212 XXX XXX XXX</span>
              </a>
              <a href="mailto:contact@saidiabay.com" className="flex items-center gap-4 text-white/80 hover:text-white transition-colors group">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-accent-500/20 group-hover:border-accent-500/50 border border-white/10 transition-all duration-300 shadow-elegant">
                  <HiOutlineMail className="w-5 h-5 text-accent-400" />
                </div>
                <span className="font-medium">contact@saidiabay.com</span>
              </a>
              <div className="flex items-center gap-4 text-white/80">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/10 shadow-elegant">
                  <HiOutlineLocationMarker className="w-5 h-5 text-accent-400" />
                </div>
                <span className="font-medium">Saidia Bay, Morocco</span>
              </div>
            </div>

            {/* Social Links - Premium Style */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 border border-white/20 rounded-xl flex items-center justify-center hover:bg-accent-500 hover:border-accent-500 hover:scale-110 transition-all duration-300 shadow-elegant backdrop-blur-sm"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Properties Links */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-px bg-accent-500" />
              <h4 className="text-sm font-medium tracking-[0.2em] uppercase text-accent-400">
                Propriétés
              </h4>
            </div>
            <ul className="space-y-4">
              {footerLinks.properties.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-accent-400 transition-colors text-sm font-medium group flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-accent-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-px bg-accent-500" />
              <h4 className="text-sm font-medium tracking-[0.2em] uppercase text-accent-400">
                Entreprise
              </h4>
            </div>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-accent-400 transition-colors text-sm font-medium group flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-accent-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-px bg-accent-500" />
              <h4 className="text-sm font-medium tracking-[0.2em] uppercase text-accent-400">
                Support
              </h4>
            </div>
            <ul className="space-y-4">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-accent-400 transition-colors text-sm font-medium group flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-accent-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-px bg-accent-500" />
              <h4 className="text-sm font-medium tracking-[0.2em] uppercase text-accent-400">
                Newsletter
              </h4>
            </div>
            <p className="text-white/80 mb-6 text-sm leading-relaxed">
              Recevez nos dernières offres et actualités immobilières.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre email"
                required
                className="w-full px-5 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-accent-500 focus:bg-white/15 transition-all text-sm shadow-elegant"
              />
              <button
                type="submit"
                className="w-full py-3.5 bg-accent-500 text-white font-medium rounded-lg hover:bg-accent-600 transition-all text-sm shadow-gold hover:shadow-gold-lg"
              >
                S'inscrire
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/10">
        <div className="container mx-auto px-4 lg:px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm font-medium">
              © {currentYear} Saidia Bay Real Estate. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6 text-sm text-white/60">
              <Link href="/privacy" className="hover:text-accent-400 transition-colors font-medium">
                Confidentialité
              </Link>
              <span className="text-white/20">•</span>
              <Link href="/terms" className="hover:text-accent-400 transition-colors font-medium">
                Conditions
              </Link>
              <span className="text-white/20">•</span>
              <span className="text-white/40">Conception par SaidiaBay</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button - Premium Style */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary-900 border-2 border-accent-500/30 text-white rounded-full shadow-gold flex items-center justify-center hover:bg-accent-500 hover:border-accent-500 hover:scale-110 transition-all duration-300 z-40 backdrop-blur-sm"
        aria-label="Scroll to top"
      >
        <FiArrowUp className="w-6 h-6" />
      </button>
    </footer>
  );
};

export default Footer;
