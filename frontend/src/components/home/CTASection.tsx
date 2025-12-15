import Link from 'next/link';
import { FiArrowRight, FiPhone } from 'react-icons/fi';

const CTASection = () => {
  return (
    <section className="section bg-primary-600 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Contact us today and let our expert team help you discover the perfect 
            property in Saidia Bay. Your dream home is just a call away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="btn bg-white text-primary-600 hover:bg-primary-50"
            >
              Contact Us
              <FiArrowRight className="ml-2" />
            </Link>
            <a
              href="tel:+212600000000"
              className="btn border-2 border-white text-white hover:bg-white/10"
            >
              <FiPhone className="mr-2" />
              +212 6 00 00 00 00
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
