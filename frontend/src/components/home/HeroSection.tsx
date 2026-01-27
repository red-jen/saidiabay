'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import gsap from 'gsap';

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
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        contentRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1 }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

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
  const heroTitle = heroData?.title || "L'Excellence Immobilière\nà Saidia Bay";
  const heroSubtitle = heroData?.subtitle || "Découvrez notre collection exclusive de propriétés d'exception sur la côte méditerranéenne du Maroc";

  return (
    <section ref={heroRef} className="relative min-h-[85vh] flex items-center pt-[200px] lg:pt-[220px]">
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
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950/85 via-primary-900/75 to-primary-900/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/60 via-transparent to-primary-950/30" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary-950/40 to-transparent" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1 bg-gradient-to-r from-accent-500 to-transparent" />

      {/* Main Content */}
      <div className="relative container mx-auto px-4 lg:px-6 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div ref={contentRef} className="max-w-2xl">
            {/* Brand Label */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-px bg-accent-500" />
              <span className="text-accent-400 text-sm font-medium tracking-[0.2em] uppercase">
                Saidia Bay Real Estate
              </span>
            </div>

            {/* Main Title */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-medium leading-[1.1] mb-6">
              {heroTitle.split('\n').map((line, index) => (
                <span key={index} className="block">
                  {index === 1 ? (
                    <span className="text-accent-400">{line}</span>
                  ) : (
                    line
                  )}
                </span>
              ))}
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-8 max-w-xl">
              {heroSubtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4">
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

          {/* Right Side - Empty for now, can add content later */}
          <div className="hidden lg:block" />
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
