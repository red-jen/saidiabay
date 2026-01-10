'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroSearch from './HeroSearch';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current?.children || [],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-[85vh] flex items-center pt-20">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=85"
          alt="Luxury Property"
          fill
          className="object-cover"
          priority
        />
        {/* Simple gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/30" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div ref={contentRef} className="max-w-3xl">
          {/* Simple Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-semibold text-white leading-tight mb-4 tracking-tight">
            Find Your Best
            <span className="block">Staycation</span>
          </h1>

          {/* Simple Subheading */}
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-xl font-light">
            Discover premium properties in Saidia Bay for your perfect getaway
          </p>

          {/* Clean Search Box */}
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-2xl">
            <HeroSearch />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
