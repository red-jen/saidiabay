import { FiHome, FiKey, FiDollarSign, FiFileText, FiTool, FiHeadphones } from 'react-icons/fi';

const services = [
  {
    icon: FiHome,
    title: 'Property Sales',
    description: 'Find your dream property or sell your existing one with our expert guidance and market knowledge.',
  },
  {
    icon: FiKey,
    title: 'Property Rentals',
    description: 'Explore our extensive catalog of rental properties, from cozy studios to luxury villas.',
  },
  {
    icon: FiDollarSign,
    title: 'Investment Advisory',
    description: 'Get expert advice on real estate investments and maximize your returns in Saidia Bay.',
  },
  {
    icon: FiFileText,
    title: 'Legal Assistance',
    description: 'Navigate property transactions smoothly with our comprehensive legal support services.',
  },
  {
    icon: FiTool,
    title: 'Property Management',
    description: 'Professional management services for property owners, including maintenance and tenant relations.',
  },
  {
    icon: FiHeadphones,
    title: '24/7 Support',
    description: 'Our dedicated team is always available to answer your questions and provide assistance.',
  },
];

const ServicesSection = () => {
  return (
    <section className="section bg-secondary-50">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">
            Comprehensive real estate services tailored to your needs
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                <service.icon className="text-primary-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-3">
                {service.title}
              </h3>
              <p className="text-secondary-600">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
