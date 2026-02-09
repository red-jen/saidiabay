'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Image from 'next/image';
import HeroSection from './HeroSection';
import gsap from 'gsap';

interface HeroData {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  ctaText?: string;
  ctaLink?: string;
  order: number;
  isActive: boolean;
}

interface HeroCarouselProps {
  heroes: HeroData[];
  autoPlayInterval?: number; // in milliseconds, default 5000
}

// Simple image-only hero for non-first slides
const SimpleHeroImage = ({ hero }: { hero: HeroData }) => {
  const router = useRouter();
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, []);

  const handleClick = () => {
    if (hero.ctaLink) {
      if (hero.ctaLink.startsWith('http')) {
        window.open(hero.ctaLink, '_blank');
      } else {
        router.push(hero.ctaLink);
      }
    }
  };

  return (
    <div 
      ref={imageRef}
      className="absolute inset-0 cursor-pointer"
      onClick={handleClick}
    >
      {/* Background Image */}
      <Image
        src={hero.imageUrl}
        alt={hero.title}
        fill
        priority
        className="object-cover"
        quality={90}
      />
      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors" />

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-16 md:h-32 bg-gradient-to-b from-primary-950/40 to-transparent" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1 bg-gradient-to-r from-accent-500 to-transparent" />
    </div>
  );
};

const HeroCarousel = ({ heroes, autoPlayInterval = 5000 }: HeroCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Auto-play functionality
  useEffect(() => {
    if (heroes.length <= 1) return;

    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % heroes.length);
      }, autoPlayInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, heroes.length, autoPlayInterval]);

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  // Navigation functions
  const goToSlide = useCallback((index: number) => {
    if (index < 0) {
      setCurrentIndex(heroes.length - 1);
    } else if (index >= heroes.length) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(index);
    }
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), autoPlayInterval * 2);
  }, [heroes.length, autoPlayInterval]);

  const goToPrevious = () => goToSlide(currentIndex - 1);
  const goToNext = () => goToSlide(currentIndex + 1);

  // Animate slide transitions
  useEffect(() => {
    if (carouselRef.current) {
      gsap.fromTo(
        carouselRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [currentIndex]);

  if (heroes.length === 0) {
    return null;
  }

  const currentHero = heroes[currentIndex];
  const isFirstHero = currentIndex === 0;

  return (
    <div
      className="relative w-full aspect-[4/5] sm:aspect-[4/3] md:aspect-[16/9] overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Carousel Content - child fills via absolute */}
      <div 
        ref={carouselRef} 
        key={currentHero.id}
        className="absolute inset-0"
      >
        {isFirstHero ? (
          <HeroSection heroData={currentHero} />
        ) : (
          <SimpleHeroImage hero={currentHero} />
        )}
      </div>

      {/* Navigation Buttons - Only show if more than 1 hero */}
      {heroes.length > 1 && (
        <>
          {/* Previous Button */}
          <button
            onClick={goToPrevious}
            className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 md:w-14 md:h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 shadow-lg border border-white/20 hover:scale-110 group"
            aria-label="Previous slide"
          >
            <FiChevronLeft className="w-5 h-5 sm:w-5 sm:h-5 md:w-7 md:h-7 group-hover:-translate-x-1 transition-transform" />
          </button>

          {/* Next Button */}
          <button
            onClick={goToNext}
            className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 md:w-14 md:h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 shadow-lg border border-white/20 hover:scale-110 group"
            aria-label="Next slide"
          >
            <FiChevronRight className="w-5 h-5 sm:w-5 sm:h-5 md:w-7 md:h-7 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 sm:bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 sm:gap-2">
            {heroes.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? 'w-7 sm:w-8 h-2 bg-white shadow-lg'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Slide Counter */}
          <div className="absolute top-4 sm:top-6 md:top-8 right-4 sm:right-6 md:right-8 z-30 bg-white/10 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-white text-xs md:text-sm font-medium border border-white/20">
            {currentIndex + 1} / {heroes.length}
          </div>
        </>
      )}
    </div>
  );
};

export default HeroCarousel;
