import Link from 'next/link';
import { FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'About us', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Contact us', href: '/contact' },
    ],
    properties: [
      { label: 'Browse All', href: '/properties' },
      { label: 'For Sale', href: '/properties?listingType=VENTE' },
      { label: 'For Rent', href: '/properties?listingType=LOCATION' },
      { label: 'Featured', href: '/properties?featured=true' },
    ],
    support: [
      { label: 'Help Center', href: '/faq' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'List Property', href: '/contact' },
    ],
  };

  const socialLinks = [
    { icon: FiFacebook, href: '#', label: 'Facebook' },
    { icon: FiTwitter, href: '#', label: 'Twitter' },
    { icon: FiInstagram, href: '#', label: 'Instagram' },
  ];

  return (
    <footer className="border-t border-secondary-200 bg-secondary-50">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-accent-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-display font-bold text-lg">S</span>
              </div>
              <span className="font-display font-semibold text-xl text-secondary-900">
                saidiabay
              </span>
            </Link>
            <p className="text-sm text-secondary-600 mb-4">
              Your trusted partner for luxury real estate in Saidia Bay, Morocco's Mediterranean paradise.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-secondary-900 mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary-600 hover:text-secondary-900 hover:underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Properties */}
          <div>
            <h3 className="font-semibold text-secondary-900 mb-4">Properties</h3>
            <ul className="space-y-3">
              {footerLinks.properties.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary-600 hover:text-secondary-900 hover:underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-secondary-900 mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary-600 hover:text-secondary-900 hover:underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-secondary-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright & Links */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-secondary-600">
              <span>© {currentYear} SaidiaBay, Inc.</span>
              <span>·</span>
              <Link href="/privacy" className="hover:underline">Privacy</Link>
              <span>·</span>
              <Link href="/terms" className="hover:underline">Terms</Link>
              <span>·</span>
              <Link href="/sitemap" className="hover:underline">Sitemap</Link>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary-700 hover:text-secondary-900 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
