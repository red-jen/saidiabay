'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiSearch, FiMapPin, FiHome, FiCalendar, FiUsers, FiChevronDown } from 'react-icons/fi';
import gsap from 'gsap';

const propertyTypes = [
  { id: 'all', label: 'Tous types', icon: '🏠' },
  { id: 'villa', label: 'Villas', icon: '🏡' },
  { id: 'apartment', label: 'Appartements', icon: '🏢' },
  { id: 'house', label: 'Maisons', icon: '🏘️' },
  { id: 'studio', label: 'Studios', icon: '🛏️' },
];

const HeroSection = () => {
  const router = useRouter();
  const [activeType, setActiveType] = useState('all');
  const [searchParams, setSearchParams] = useState({
    location: '',
    listingType: '',
  });

  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Main timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Animate hero content
      tl.fromTo(
        headlineRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1 }
      )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.6'
        )
        .fromTo(
          searchBoxRef.current,
          { opacity: 0, y: 50, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8 },
          '-=0.5'
        )
        .fromTo(
          filtersRef.current?.children || [],
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
          '-=0.4'
        )
        .fromTo(
          statsRef.current?.children || [],
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1 },
          '-=0.3'
        );

      // Parallax effect on scroll
      gsap.to(imageRef.current, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchParams.location) params.append('location', searchParams.location);
    if (searchParams.listingType) params.append('listingType', searchParams.listingType);
    if (activeType !== 'all') params.append('type', activeType);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section ref={heroRef} className="relative min-h-screen pt-32 lg:pt-40 pb-20 overflow-hidden">
      {/* Background */}
      <div ref={imageRef} className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=80"
          alt="Luxury Property"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/90 to-white/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-4 lg:px-6">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-100 rounded-full mb-6 animate-fade-in">
            <span className="w-2 h-2 bg-accent-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-accent-800">
              Morocco's Premier Real Estate Platform
            </span>
          </div>

          {/* Headline */}
          <h1
            ref={headlineRef}
            className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold text-secondary-900 leading-tight mb-6"
          >
            Trouvez Votre
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-900 via-primary-700 to-accent-600">
              Propriété de Rêve
            </span>
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-lg lg:text-xl text-secondary-600 max-w-2xl mb-10"
          >
            Découvrez des villas de luxe, des appartements modernes et des propriétés exclusives à Saidia Bay.
            Votre maison méditerranéenne idéale vous attend.
          </p>

          {/* Search Box */}
          <div
            ref={searchBoxRef}
            className="bg-white rounded-2xl shadow-luxury-lg p-3 mb-8"
          >
            <div className="grid md:grid-cols-4 gap-3">
              {/* Location */}
              <div className="relative">
                <div className="flex items-center gap-3 px-4 py-3 bg-secondary-50 rounded-xl hover:bg-secondary-100 transition-colors cursor-pointer">
                  <FiMapPin className="w-5 h-5 text-primary-600" />
                  <div className="flex-1">
                    <p className="text-xs text-secondary-500 uppercase tracking-wide">Localisation</p>
                    <input
                      type="text"
                      placeholder="Où souhaitez-vous habiter ?"
                      value={searchParams.location}
                      onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                      className="w-full bg-transparent text-sm font-medium text-secondary-900 placeholder:text-secondary-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Property Type */}
              <div className="relative">
                <div className="flex items-center gap-3 px-4 py-3 bg-secondary-50 rounded-xl hover:bg-secondary-100 transition-colors cursor-pointer">
                  <FiHome className="w-5 h-5 text-primary-600" />
                  <div className="flex-1">
                    <p className="text-xs text-secondary-500 uppercase tracking-wide">Type</p>
                    <select
                      value={activeType}
                      onChange={(e) => setActiveType(e.target.value)}
                      className="w-full bg-transparent text-sm font-medium text-secondary-900 focus:outline-none appearance-none cursor-pointer"
                    >
                      {propertyTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <FiChevronDown className="w-4 h-4 text-secondary-400" />
                </div>
              </div>

              {/* Listing Type */}
              <div className="relative">
                <div className="flex items-center gap-3 px-4 py-3 bg-secondary-50 rounded-xl hover:bg-secondary-100 transition-colors cursor-pointer">
                  <FiCalendar className="w-5 h-5 text-primary-600" />
                  <div className="flex-1">
                    <p className="text-xs text-secondary-500 uppercase tracking-wide">Pour</p>
                    <select
                      value={searchParams.listingType}
                      onChange={(e) => setSearchParams({ ...searchParams, listingType: e.target.value })}
                      className="w-full bg-transparent text-sm font-medium text-secondary-900 focus:outline-none appearance-none cursor-pointer"
                    >
                      <option value="">Louer ou Acheter</option>
                      <option value="LOCATION">À Louer</option>
                      <option value="VENTE">À Vendre</option>
                    </select>
                  </div>
                  <FiChevronDown className="w-4 h-4 text-secondary-400" />
                </div>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-900 to-primary-700 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <FiSearch className="w-5 h-5" />
                <span>Rechercher</span>
              </button>
            </div>
          </div>

          {/* Quick Filters */}
          <div ref={filtersRef} className="flex flex-wrap gap-2 mb-12">
            {propertyTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveType(type.id)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all
                  ${activeType === type.id
                    ? 'bg-primary-900 text-white shadow-md'
                    : 'bg-white/80 text-secondary-700 hover:bg-white hover:shadow-md backdrop-blur-sm'
                  }
                `}
              >
                <span>{type.icon}</span>
                <span>{type.label}</span>
              </button>
            ))}
          </div>

          {/* Stats */}
          <div ref={statsRef} className="grid grid-cols-3 gap-6 max-w-lg">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-heading font-bold text-primary-900 mb-1">
                500+
              </div>
              <div className="text-sm text-secondary-600">Propriétés</div>
            </div>
            <div className="text-center border-x border-secondary-200">
              <div className="text-3xl lg:text-4xl font-heading font-bold text-primary-900 mb-1">
                1.2K+
              </div>
              <div className="text-sm text-secondary-600">Clients Satisfaits</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-heading font-bold text-primary-900 mb-1">
                10+
              </div>
              <div className="text-sm text-secondary-600">Années d'Expérience</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Cards - Right Side */}
      <div className="hidden xl:block absolute right-12 top-1/2 -translate-y-1/2 space-y-4">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-luxury animate-float">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
                alt="Client"
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-semibold text-secondary-900">Sarah M.</p>
              <p className="text-xs text-secondary-500">Vient d'acheter une villa</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-luxury animate-float" style={{ animationDelay: '1s' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center">
              <span className="text-xl">🎉</span>
            </div>
            <div>
              <p className="font-semibold text-success-700">+25 Propriétés</p>
              <p className="text-xs text-secondary-500">Ajoutées cette semaine</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs text-secondary-500 uppercase tracking-wider">Défiler</span>
        <div className="w-6 h-10 border-2 border-secondary-300 rounded-full flex items-start justify-center p-1.5">
          <div className="w-1.5 h-3 bg-secondary-400 rounded-full animate-scroll" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
