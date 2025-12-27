import Link from 'next/link';
import { FiArrowRight, FiPhone } from 'react-icons/fi';

const CTASection = () => {
  return (
    <section className="section relative overflow-hidden">
      {/* Background with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-accent-900" />
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-6">
            <span className="w-2 h-2 bg-accent-500 rounded-full animate-pulse" />
            <span className="text-white text-sm font-medium tracking-wide">
              Start Your Journey Today
            </span>
          </div>

          {/* Headline */}
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6 leading-tight">
            Ready to Find Your Dream Property?
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Whether you're buying, selling, or renting, our expert team is here to guide you every step of the way.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/properties" 
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-primary-900 rounded-lg font-semibold hover:bg-white/95 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <span>Browse Properties</span>
              <FiArrowRight size={20} />
            </Link>
            
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 rounded-lg font-semibold hover:bg-white/20 transition-all"
            >
              <FiPhone size={20} />
              <span>Contact Us</span>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-12 border-t border-white/20">
            {[
              { value: '24/7', label: 'Support' },
              { value: '100%', label: 'Verified' },
              { value: '4.9★', label: 'Rating' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-heading font-semibold text-white mb-1">
                  {item.value}
                </div>
                <div className="text-sm text-white/70 uppercase tracking-wide">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
