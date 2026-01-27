'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiSearch, FiMapPin, FiHome, FiCalendar, FiChevronDown } from 'react-icons/fi';
import gsap from 'gsap';

const propertyTypes = [
  { id: 'all', label: 'Tous types', icon: '🏠' },
  { id: 'villa', label: 'Villas', icon: '🏡' },
  { id: 'apartment', label: 'Appartements', icon: '🏢' },
  { id: 'house', label: 'Maisons', icon: '🏘️' },
  { id: 'studio', label: 'Studios', icon: '🛏️' },
];

interface HeroSectionProps {
  heroData?: {
    id: string;
    title: string;
    subtitle?: string;
    imageUrl: string;
    ctaText?: string;
    ctaLink?: string;
    order: number;
    isActive: boolean;
  };
}

const HeroSection = ({ heroData }: HeroSectionProps) => {
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
          '-=0.5'
        )
        .fromTo(
          searchBoxRef.current,
          { opacity: 0, y: 50, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8 },
          '-=0.5'
        );

      // Parallax effect on scroll
      gsap.to(imageRef.current, {
        yPercent: 15,
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

  // Use backend hero data or fallback to default
  const heroImage = heroData?.imageUrl || "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=80";
  const heroTitle = heroData?.title || "Découvrez Votre Propriété Idéale";
  const heroSubtitle = heroData?.subtitle || "Explorez notre sélection exclusive de biens immobiliers d'exception";

  const handleCTAClick = () => {
    if (heroData?.ctaLink) {
      if (heroData.ctaLink.startsWith('http')) {
        window.open(heroData.ctaLink, '_blank');
      } else {
        router.push(heroData.ctaLink);
      }
    }
  };

  return (
    <section ref={heroRef} className="relative h-[85vh] min-h-[600px] overflow-hidden">
      {/* Hero Background Image */}
      <div ref={imageRef} className="absolute inset-0 -z-10">
        <Image
          src={heroImage}
          alt={heroTitle}
          fill
          priority
          className="object-cover"
        />
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
      </div>

      <div className="container mx-auto px-4 lg:px-6 h-full flex flex-col justify-center">
        <div className="max-w-4xl pt-20">
          {/* Dynamic Headline from API */}
          <h1
            ref={headlineRef}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white leading-tight mb-6 drop-shadow-2xl"
          >
            {heroTitle.split('\n').map((line, index) => (
              <span key={index}>
                {line}
                {index < heroTitle.split('\n').length - 1 && <br />}
              </span>
            ))}
          </h1>
          
          {/* Dynamic Subtitle/Description from API */}
          {heroSubtitle && (
            <p
              ref={subtitleRef}
              className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 max-w-2xl leading-relaxed drop-shadow-lg"
            >
              {heroSubtitle}
            </p>
          )}

          {/* CTA Button if provided */}
          {heroData?.ctaText && (
            <button
              onClick={handleCTAClick}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-bold text-lg hover:from-primary-700 hover:to-primary-800 shadow-2xl hover:shadow-3xl hover:scale-105 active:scale-100 transition-all"
            >
              {heroData.ctaText}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Enlarged Search Bar - Positioned at Bottom to Bridge Sections */}
      <div className="absolute bottom-0 left-0 right-0 pb-16 transform translate-y-1/2 z-20">
        <div className="container mx-auto px-4 lg:px-6">
          <div
            ref={searchBoxRef}
            className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 lg:p-8 max-w-6xl mx-auto border border-white/20"
          >
            <div className="grid md:grid-cols-4 gap-4 lg:gap-6">
              {/* Location */}
              <div className="relative">
                <div className="flex items-center gap-4 px-5 py-4 bg-secondary-50 rounded-2xl hover:bg-secondary-100 transition-all cursor-pointer group hover:shadow-md">
                  <FiMapPin className="w-6 h-6 text-primary-600 group-hover:scale-110 transition-transform" />
                  <div className="flex-1">
                    <p className="text-xs text-secondary-500 uppercase tracking-wide font-semibold mb-1">Localisation</p>
                    <input
                      type="text"
                      placeholder="Où souhaitez-vous habiter ?"
                      value={searchParams.location}
                      onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                      className="w-full bg-transparent text-base font-medium text-secondary-900 placeholder:text-secondary-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Property Type */}
              <div className="relative">
                <div className="flex items-center gap-4 px-5 py-4 bg-secondary-50 rounded-2xl hover:bg-secondary-100 transition-all cursor-pointer group hover:shadow-md">
                  <FiHome className="w-6 h-6 text-primary-600 group-hover:scale-110 transition-transform" />
                  <div className="flex-1">
                    <p className="text-xs text-secondary-500 uppercase tracking-wide font-semibold mb-1">Type</p>
                    <select
                      value={activeType}
                      onChange={(e) => setActiveType(e.target.value)}
                      className="w-full bg-transparent text-base font-medium text-secondary-900 focus:outline-none appearance-none cursor-pointer"
                    >
                      {propertyTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <FiChevronDown className="w-5 h-5 text-secondary-400" />
                </div>
              </div>

              {/* Listing Type */}
              <div className="relative">
                <div className="flex items-center gap-4 px-5 py-4 bg-secondary-50 rounded-2xl hover:bg-secondary-100 transition-all cursor-pointer group hover:shadow-md">
                  <FiCalendar className="w-6 h-6 text-primary-600 group-hover:scale-110 transition-transform" />
                  <div className="flex-1">
                    <p className="text-xs text-secondary-500 uppercase tracking-wide font-semibold mb-1">Pour</p>
                    <select
                      value={searchParams.listingType}
                      onChange={(e) => setSearchParams({ ...searchParams, listingType: e.target.value })}
                      className="w-full bg-transparent text-base font-medium text-secondary-900 focus:outline-none appearance-none cursor-pointer"
                    >
                      <option value="">Louer ou Acheter</option>
                      <option value="LOCATION">À Louer</option>
                      <option value="VENTE">À Vendre</option>
                    </select>
                  </div>
                  <FiChevronDown className="w-5 h-5 text-secondary-400" />
                </div>
              </div>

              {/* Search Button - Larger and More Prominent */}
              <button
                onClick={handleSearch}
                className="flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-[1.03] active:scale-[0.98] transition-all"
              >
                <FiSearch className="w-6 h-6" />
                <span>Rechercher</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
