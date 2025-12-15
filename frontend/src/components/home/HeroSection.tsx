import Link from 'next/link';
import { FiSearch, FiHome, FiMapPin } from 'react-icons/fi';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900 min-h-[600px] flex items-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto relative z-10 py-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-primary-300 text-sm mb-6">
            <FiHome size={16} />
            <span>Premier Real Estate in Saidia Bay</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Find Your Perfect
            <span className="text-gradient block">Property in Paradise</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-secondary-300 mb-8 max-w-2xl">
            Discover premium apartments, stunning villas, and exceptional real estate 
            opportunities in the beautiful Saidia Bay region.
          </p>

          {/* Search Box */}
          <div className="bg-white p-4 rounded-xl shadow-2xl max-w-2xl">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-secondary-500 text-sm mb-1 block">Location</label>
                <div className="flex items-center gap-2 text-secondary-700">
                  <FiMapPin className="text-primary-600" />
                  <input
                    type="text"
                    placeholder="Search by city or area..."
                    className="w-full outline-none text-secondary-800"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="text-secondary-500 text-sm mb-1 block">Property Type</label>
                <select className="w-full outline-none text-secondary-700 bg-transparent">
                  <option value="">All Types</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="house">House</option>
                  <option value="studio">Studio</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="text-secondary-500 text-sm mb-1 block">Listing Type</label>
                <select className="w-full outline-none text-secondary-700 bg-transparent">
                  <option value="">Buy or Rent</option>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>
              <div className="flex items-end">
                <Link href="/properties" className="btn-primary whitespace-nowrap">
                  <FiSearch className="mr-2" />
                  Search
                </Link>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-12">
            <div>
              <div className="text-3xl font-bold text-white">500+</div>
              <div className="text-secondary-400">Properties Listed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">1000+</div>
              <div className="text-secondary-400">Happy Clients</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">10+</div>
              <div className="text-secondary-400">Years Experience</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
