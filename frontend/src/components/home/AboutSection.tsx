import { FiCheck, FiAward, FiUsers, FiHome } from 'react-icons/fi';

const AboutSection = () => {
  const features = [
    'Extensive property portfolio in Saidia Bay',
    'Personalized property search assistance',
    'Transparent pricing with no hidden fees',
    'Professional property management services',
    'Legal assistance for property transactions',
    'After-sale support and maintenance',
  ];

  return (
    <section className="section">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="bg-secondary-200 rounded-xl h-48 md:h-64" />
              <div className="bg-primary-100 rounded-xl h-32 md:h-40" />
            </div>
            <div className="space-y-4 mt-8">
              <div className="bg-primary-200 rounded-xl h-32 md:h-40" />
              <div className="bg-secondary-100 rounded-xl h-48 md:h-64" />
            </div>
          </div>

          {/* Content */}
          <div>
            <h2 className="section-title text-left">
              Your Trusted Partner in Saidia Bay Real Estate
            </h2>
            <p className="text-secondary-600 mb-8">
              With over a decade of experience in the Saidia Bay property market, we&apos;ve 
              helped thousands of clients find their perfect home or investment property. 
              Our deep local knowledge and commitment to excellence set us apart.
            </p>

            {/* Features List */}
            <ul className="grid sm:grid-cols-2 gap-3 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <FiCheck className="text-primary-600 mt-1 flex-shrink-0" />
                  <span className="text-secondary-700">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center p-4 bg-primary-50 rounded-xl">
                <FiHome className="text-primary-600 mx-auto mb-2" size={28} />
                <div className="text-2xl font-bold text-secondary-800">500+</div>
                <div className="text-sm text-secondary-600">Properties</div>
              </div>
              <div className="text-center p-4 bg-primary-50 rounded-xl">
                <FiUsers className="text-primary-600 mx-auto mb-2" size={28} />
                <div className="text-2xl font-bold text-secondary-800">1K+</div>
                <div className="text-sm text-secondary-600">Clients</div>
              </div>
              <div className="text-center p-4 bg-primary-50 rounded-xl">
                <FiAward className="text-primary-600 mx-auto mb-2" size={28} />
                <div className="text-2xl font-bold text-secondary-800">10+</div>
                <div className="text-sm text-secondary-600">Years</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
