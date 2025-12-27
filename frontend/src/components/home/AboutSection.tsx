import { FiCheck, FiShield, FiAward, FiUsers, FiTrendingUp } from 'react-icons/fi';
import Link from 'next/link';

const AboutSection = () => {
  const features = [
    'Verified luxury properties',
    'Expert market knowledge',
    'Personalized service',
    'Legal & financial support',
    'Property management',
    'Investment advisory',
  ];

  const stats = [
    { icon: FiTrendingUp, value: '500+', label: 'Premium Properties', color: 'primary' },
    { icon: FiUsers, value: '1,000+', label: 'Happy Clients', color: 'accent' },
    { icon: FiAward, value: '10+', label: 'Years Excellence', color: 'success' },
  ];

  return (
    <section className="section bg-secondary-50">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Images Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {/* Large Image */}
              <div className="col-span-2 aspect-[16/10] rounded-2xl overflow-hidden shadow-luxury">
                <div className="w-full h-full bg-gradient-to-br from-primary-200 to-primary-400" />
              </div>
              
              {/* Two Small Images */}
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                <div className="w-full h-full bg-gradient-to-br from-accent-200 to-accent-400" />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                <div className="w-full h-full bg-gradient-to-br from-success-200 to-success-400" />
              </div>
            </div>

            {/* Floating Stats Card */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-luxury-xl p-6 max-w-xs hidden lg:block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                  <FiShield className="text-accent-600" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-heading font-semibold text-secondary-900">100%</div>
                  <div className="text-sm text-secondary-500">Verified Listings</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full mb-6">
              <span className="text-primary-900 text-sm font-semibold uppercase tracking-wide">
                About Us
              </span>
            </div>

            <h2 className="font-heading text-4xl md:text-5xl font-semibold text-secondary-900 mb-6 leading-tight">
              Your Trusted Partner in Luxury Real Estate
            </h2>

            <p className="text-lg text-secondary-600 mb-8 leading-relaxed">
              With over a decade of expertise in Saidia Bay's premium property market, we've helped 
              thousands of clients discover their dream homes and make sound investment decisions.
            </p>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiCheck className="text-white" size={14} />
                  </div>
                  <span className="text-secondary-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-secondary-200">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <stat.icon className={`text-${stat.color}-700`} size={24} />
                  </div>
                  <div className="text-2xl font-heading font-semibold text-secondary-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-secondary-500 uppercase tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8">
              <Link 
                href="/about" 
                className="inline-flex items-center gap-2 text-primary-900 font-semibold hover:gap-3 transition-all"
              >
                <span>Learn More About Us</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
