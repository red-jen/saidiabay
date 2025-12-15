import Link from 'next/link';
import { FiFacebook, FiInstagram, FiTwitter, FiLinkedin, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary-900 text-secondary-300">
      {/* Main Footer */}
      <div className="container mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="font-heading font-bold text-xl text-white">
                Saidia<span className="text-primary-400">Bay</span>
              </span>
            </Link>
            <p className="text-secondary-400 mb-4">
              Your trusted partner for finding the perfect property in Saidia Bay.
              We offer premium apartments, villas, and real estate for rent and sale.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-secondary-400 hover:text-primary-400 transition-colors">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="text-secondary-400 hover:text-primary-400 transition-colors">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="text-secondary-400 hover:text-primary-400 transition-colors">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="text-secondary-400 hover:text-primary-400 transition-colors">
                <FiLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/properties" className="hover:text-primary-400 transition-colors">
                  All Properties
                </Link>
              </li>
              <li>
                <Link href="/properties?type=rent" className="hover:text-primary-400 transition-colors">
                  Properties for Rent
                </Link>
              </li>
              <li>
                <Link href="/properties?type=sale" className="hover:text-primary-400 transition-colors">
                  Properties for Sale
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary-400 transition-colors">
                  Blog & News
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary-400 transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Property Types</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/properties?type=apartment" className="hover:text-primary-400 transition-colors">
                  Apartments
                </Link>
              </li>
              <li>
                <Link href="/properties?type=villa" className="hover:text-primary-400 transition-colors">
                  Villas
                </Link>
              </li>
              <li>
                <Link href="/properties?type=house" className="hover:text-primary-400 transition-colors">
                  Houses
                </Link>
              </li>
              <li>
                <Link href="/properties?type=studio" className="hover:text-primary-400 transition-colors">
                  Studios
                </Link>
              </li>
              <li>
                <Link href="/properties?type=commercial" className="hover:text-primary-400 transition-colors">
                  Commercial
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FiMapPin className="text-primary-400 mt-1 flex-shrink-0" size={18} />
                <span>123 Boulevard Mohammed VI, Saidia Bay, Morocco</span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-primary-400 flex-shrink-0" size={18} />
                <a href="tel:+212600000000" className="hover:text-primary-400 transition-colors">
                  +212 6 00 00 00 00
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-primary-400 flex-shrink-0" size={18} />
                <a href="mailto:contact@saidiabay.com" className="hover:text-primary-400 transition-colors">
                  contact@saidiabay.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-secondary-800">
        <div className="container mx-auto py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-secondary-400 text-sm">
              © {currentYear} SaidiaBay Real Estate. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="hover:text-primary-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary-400 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
