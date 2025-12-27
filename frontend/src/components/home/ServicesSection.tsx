import { FiHome, FiKey, FiDollarSign, FiMapPin } from 'react-icons/fi';
import Link from 'next/link';

const services = [
  {
    icon: FiHome,
    title: 'Buy a property',
    description: 'Find your dream home from our curated selection of premium properties.',
    link: '/properties?listingType=sale',
    cta: 'Browse homes',
  },
  {
    icon: FiKey,
    title: 'Rent a property',
    description: 'Discover apartments, villas, and more for your next stay.',
    link: '/properties?listingType=rent',
    cta: 'Find rentals',
  },
  {
    icon: FiDollarSign,
    title: 'Sell your property',
    description: 'List your property with us and reach thousands of potential buyers.',
    link: '/contact',
    cta: 'Get started',
  },
  {
    icon: FiMapPin,
    title: 'Property management',
    description: 'Let us handle your property while you enjoy the returns.',
    link: '/contact',
    cta: 'Learn more',
  },
];

const ServicesSection = () => {
  return (
    <section className="section">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="section-title">What we offer</h2>
          <p className="section-subtitle mx-auto">
            Everything you need for your real estate journey
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Link
              key={index}
              href={service.link}
              className="group p-6 rounded-2xl border border-secondary-200 hover:border-secondary-300 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-900 transition-colors">
                <service.icon className="text-primary-900 group-hover:text-white transition-colors" size={24} />
              </div>
              <h3 className="font-semibold text-secondary-900 mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-secondary-500 mb-4">
                {service.description}
              </p>
              <span className="text-sm font-medium text-primary-900 group-hover:underline">
                {service.cta} →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
