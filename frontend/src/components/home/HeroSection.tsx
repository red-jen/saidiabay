'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FiSearch, FiMapPin, FiHome, FiChevronDown, FiArrowRight, FiCalendar } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import gsap from 'gsap';

const propertyTypes = [
  { id: 'all', label: 'Tous types' },
  { id: 'VILLA', label: 'Villas' },
  { id: 'APPARTEMENT', label: 'Appartements' },
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
    listingType: 'LOCATION',
  });
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        searchRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8 }
      )
      .fromTo(
        contentRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1 },
        '-=0.5'
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchParams.location) params.append('search', searchParams.location);
    if (searchParams.listingType) params.append('listingType', searchParams.listingType);
    if (activeType !== 'all') params.append('propertyCategory', activeType);
    if (startDate && searchParams.listingType === 'LOCATION') {
      params.append('startDate', startDate.toISOString().split('T')[0]);
    }
    if (endDate && searchParams.listingType === 'LOCATION') {
      params.append('endDate', endDate.toISOString().split('T')[0]);
    }
    router.push(`/properties?${params.toString()}`);
  };

  const handleCTAClick = () => {
    if (heroData?.ctaLink) {
      if (heroData.ctaLink.startsWith('http')) {
        window.open(heroData.ctaLink, '_blank');
      } else {
        router.push(heroData.ctaLink);
      }
    }
  };

  const heroImage = heroData?.imageUrl || "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=80";
  const heroTitle = heroData?.title || "Trouvez votre propriété idéale";
  const heroSubtitle = heroData?.subtitle || "Recherchez des offres sur des villas, appartements et plus encore";
  const isRental = searchParams.listingType === 'LOCATION';

  return (
    <section ref={heroRef} className="relative min-h-screen flex flex-col">
      {/* Background Image with Premium Overlay */}
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt={heroTitle.replace(/\n/g, ' ')}
          fill
          priority
          className="object-cover"
          quality={90}
        />
        {/* Multi-layer overlay for premium look */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950/90 via-primary-900/70 to-primary-900/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/60 via-transparent to-primary-950/30" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary-950/50 to-transparent" />

      {/* Horizontal Search Bar - Positioned at Top (Booking.com style) */}
      <div className="relative container mx-auto px-4 lg:px-6 pt-28 pb-6">
        <div ref={searchRef} className="max-w-6xl mx-auto">
          {/* Main Title */}
          <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl text-white font-medium mb-2 text-center">
            {heroTitle}
          </h1>
          <p className="text-white/80 text-center mb-6 text-sm md:text-base">
            {heroSubtitle}
          </p>

          {/* Horizontal Search Bar - Booking.com Style */}
          <div className="bg-white rounded-2xl shadow-elegant-xl p-2 border-2 border-accent-400">
            <div className="flex flex-col lg:flex-row gap-0">
              {/* Location */}
              <div className="flex-1 relative">
                <div className="flex items-center gap-3 px-4 py-3 border-r border-secondary-200 cursor-pointer hover:bg-secondary-50 rounded-l-lg transition-colors h-full">
                  <FiMapPin className="w-5 h-5 text-accent-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      placeholder="Où allez-vous ?"
                      value={searchParams.location}
                      onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                      className="w-full bg-transparent text-sm font-medium text-primary-900 placeholder:text-secondary-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Property Type */}
              <div className="flex-1 relative">
                <div className="flex items-center gap-3 px-4 py-3 border-r border-secondary-200 cursor-pointer hover:bg-secondary-50 transition-colors h-full">
                  <FiHome className="w-5 h-5 text-accent-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <select
                      value={activeType}
                      onChange={(e) => setActiveType(e.target.value)}
                      className="w-full bg-transparent text-sm font-medium text-primary-900 focus:outline-none appearance-none cursor-pointer"
                    >
                      {propertyTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <FiChevronDown className="w-4 h-4 text-secondary-400 flex-shrink-0" />
                </div>
              </div>

              {/* Date Range - Only for Rentals */}
              {isRental ? (
                <div className="flex-1 relative">
                  <div className="flex items-center gap-3 px-4 py-3 border-r border-secondary-200 cursor-pointer hover:bg-secondary-50 transition-colors h-full">
                    <FiCalendar className="w-5 h-5 text-accent-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0 relative h-full flex items-center">
                      <div className="pointer-events-none flex-1">
                        {startDate && endDate ? (
                          <div className="text-sm font-medium text-primary-900">
                            {startDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })} — {endDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                          </div>
                        ) : startDate ? (
                          <div className="text-sm font-medium text-primary-900">
                            {startDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })} — Date de départ
                          </div>
                        ) : (
                          <span className="text-sm text-secondary-500">Date d'arrivée — Date de départ</span>
                        )}
                      </div>
                      <DatePicker
                        selected={startDate}
                        onChange={(dates: Date | [Date | null, Date | null] | null) => {
                          if (dates) {
                            if (Array.isArray(dates)) {
                              setStartDate(dates[0]);
                              setEndDate(dates[1]);
                            } else {
                              setStartDate(dates);
                            }
                          }
                        }}
                        startDate={startDate}
                        endDate={endDate}
                        selectsRange
                        minDate={new Date()}
                        dateFormat="dd MMM"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        wrapperClassName="absolute inset-0"
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="flex items-center justify-center gap-2 px-6 lg:px-8 py-3 bg-accent-500 text-white font-semibold rounded-r-lg hover:bg-accent-600 transition-all text-sm lg:text-base whitespace-nowrap"
              >
                <FiSearch className="w-5 h-5" />
                <span className="hidden sm:inline">Rechercher</span>
              </button>
            </div>

            {/* Listing Type Toggle - Below Search Bar */}
            <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-secondary-100">
              <button
                onClick={() => {
                  setSearchParams({ ...searchParams, listingType: 'LOCATION' });
                  setStartDate(null);
                  setEndDate(null);
                }}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
                  searchParams.listingType === 'LOCATION'
                    ? 'bg-primary-900 text-white'
                    : 'text-primary-700 hover:bg-secondary-100'
                }`}
              >
                Location
              </button>
              <button
                onClick={() => {
                  setSearchParams({ ...searchParams, listingType: 'VENTE' });
                  setStartDate(null);
                  setEndDate(null);
                }}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
                  searchParams.listingType === 'VENTE'
                    ? 'bg-primary-900 text-white'
                    : 'text-primary-700 hover:bg-secondary-100'
                }`}
              >
                Achat
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Below Search Bar */}
      <div className="relative container mx-auto px-4 lg:px-6 flex-1 flex items-center pb-20">
        <div ref={contentRef} className="max-w-3xl mx-auto text-center">
          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-8 mt-8">
            <div>
              <div className="text-3xl font-serif font-medium text-white">150+</div>
              <div className="text-sm text-white/60">Propriétés</div>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div>
              <div className="text-3xl font-serif font-medium text-white">98%</div>
              <div className="text-sm text-white/60">Satisfaction</div>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div>
              <div className="text-3xl font-serif font-medium text-white">10+</div>
              <div className="text-sm text-white/60">Années</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-12">
            {heroData?.ctaText ? (
              <button
                onClick={handleCTAClick}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-accent-500 text-white font-medium rounded-lg hover:bg-accent-600 transition-all shadow-gold"
              >
                {heroData.ctaText}
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <Link
                href="/properties"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-accent-500 text-white font-medium rounded-lg hover:bg-accent-600 transition-all shadow-gold"
              >
                Explorer les Propriétés
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-medium rounded-lg hover:bg-white/10 hover:border-white/50 transition-all"
            >
              Nous Contacter
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60">
        <span className="text-xs tracking-wider">Découvrir</span>
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/60 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
