'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiSearch, FiMapPin, FiHome, FiCalendar, FiArrowRight, FiPlay } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { adsApi } from '@/lib/api';
import { Ad } from '@/types';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

const HeroSection = () => {
  const router = useRouter();
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    city: '',
    type: '',
    listingType: '',
  });

  // Premium fallback slides with high-end imagery
  const defaultSlides = [
    {
      id: 'default-1',
      title: 'Discover Waterfront Living',
      description: 'Exclusive beachfront properties with breathtaking Mediterranean views',
      imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop',
      linkUrl: '/properties?type=villa',
    },
    {
      id: 'default-2',
      title: 'Modern Urban Elegance',
      description: 'Sophisticated apartments in the heart of Saidia Bay',
      imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop',
      linkUrl: '/properties?type=apartment',
    },
    {
      id: 'default-3',
      title: 'Your Private Sanctuary',
      description: 'Luxury estates with world-class amenities and privacy',
      imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop',
      linkUrl: '/properties',
    },
  ];

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await adsApi.getActive('hero');
        if (response.data.data && response.data.data.length > 0) {
          setAds(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching ads:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAds();
  }, []);

  const slides = ads.length > 0 ? ads : defaultSlides;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchParams.city) params.set('city', searchParams.city);
    if (searchParams.type) params.set('type', searchParams.type);
    if (searchParams.listingType) params.set('listingType', searchParams.listingType);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative h-screen min-h-[700px] w-full bg-secondary-900 overflow-hidden">
      {/* Immersive Background Slider */}
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        speed={2000}
        autoplay={{
          delay: 7000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          el: '.hero-pagination',
        }}
        loop={true}
        className="h-full w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id || index} className="relative h-full w-full">
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={slide.imageUrl}
                alt={slide.title || 'Luxury Property'}
                fill
                className="object-cover"
                priority={index === 0}
                quality={90}
              />
              {/* Cinematic Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-secondary-900 via-secondary-900/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/40 via-transparent to-secondary-900/40" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="max-w-5xl">
                  {/* Small Label */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-6 animate-fade-in">
                    <span className="w-2 h-2 bg-accent-500 rounded-full animate-pulse" />
                    <span className="text-white text-sm font-medium tracking-wide">
                      Premium Real Estate
                    </span>
                  </div>

                  {/* Main Headline - Editorial Style */}
                  <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.1] mb-6 animate-fade-in-up">
                    {slide.title || 'Discover Your Perfect Home'}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-lg md:text-xl lg:text-2xl text-white/90 font-light max-w-2xl mb-8 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    {slide.description || 'Explore our curated collection of exceptional properties'}
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <button 
                      onClick={() => router.push((slide as any).linkUrl || '/properties')}
                      className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-secondary-900 rounded-lg font-semibold hover:bg-white/95 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                    >
                      <span>Explore Properties</span>
                      <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                    </button>
                    
                    <button 
                      onClick={() => router.push('/contact')}
                      className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 rounded-lg font-semibold hover:bg-white/20 transition-all"
                    >
                      <span>Schedule Viewing</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Pagination */}
      <div className="hero-pagination absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2" />

      {/* Floating Search Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-30 px-4 pb-8 md:pb-12">
        <div className="container mx-auto max-w-6xl">
          <form 
            onSubmit={handleSearch}
            className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-3 md:p-4 border border-white/20"
          >
            <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr_1fr_auto] gap-3 items-center">
              {/* Location */}
              <div className="group">
                <div className="flex items-center gap-3 px-4 py-3 bg-secondary-50/50 rounded-xl hover:bg-white border border-transparent hover:border-secondary-200 hover:shadow-md transition-all">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiMapPin className="text-primary-900" size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-xs font-bold text-secondary-500 uppercase tracking-wider mb-0.5">
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="City, neighborhood..."
                      className="w-full bg-transparent outline-none text-secondary-900 placeholder:text-secondary-400 font-medium text-sm"
                      value={searchParams.city}
                      onChange={(e) => setSearchParams({ ...searchParams, city: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Property Type */}
              <div className="group">
                <div className="flex items-center gap-3 px-4 py-3 bg-secondary-50/50 rounded-xl hover:bg-white border border-transparent hover:border-secondary-200 hover:shadow-md transition-all">
                  <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiHome className="text-accent-700" size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-xs font-bold text-secondary-500 uppercase tracking-wider mb-0.5">
                      Type
                    </label>
                    <select
                      className="w-full bg-transparent outline-none text-secondary-900 font-medium cursor-pointer appearance-none text-sm"
                      value={searchParams.type}
                      onChange={(e) => setSearchParams({ ...searchParams, type: e.target.value })}
                    >
                      <option value="">All Types</option>
                      <option value="apartment">Apartment</option>
                      <option value="villa">Villa</option>
                      <option value="house">House</option>
                      <option value="studio">Studio</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Purpose */}
              <div className="group">
                <div className="flex items-center gap-3 px-4 py-3 bg-secondary-50/50 rounded-xl hover:bg-white border border-transparent hover:border-secondary-200 hover:shadow-md transition-all">
                  <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiCalendar className="text-success-700" size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-xs font-bold text-secondary-500 uppercase tracking-wider mb-0.5">
                      Purpose
                    </label>
                    <select
                      className="w-full bg-transparent outline-none text-secondary-900 font-medium cursor-pointer appearance-none text-sm"
                      value={searchParams.listingType}
                      onChange={(e) => setSearchParams({ ...searchParams, listingType: e.target.value })}
                    >
                      <option value="">Rent or Buy</option>
                      <option value="rent">For Rent</option>
                      <option value="sale">For Sale</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="h-full min-h-[70px] md:min-h-[auto] bg-primary-900 hover:bg-primary-800 text-white rounded-xl px-6 md:px-8 font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 group"
              >
                <FiSearch size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                <span className="hidden md:inline">Search</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2 text-white/60 animate-bounce">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-white/30" />
      </div>
    </section>
  );
};

export default HeroSection;
