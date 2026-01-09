'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowDown } from 'react-icons/fi';
import HeroSearch from './HeroSearch';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Initial Animation
      tl.fromTo(
        videoRef.current,
        { opacity: 0, scale: 1.1 },
        { opacity: 1, scale: 1, duration: 2, ease: 'power2.out' }
      )
        .fromTo(
          contentRef.current?.children || [],
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.2 },
          '-=1.5'
        )
        .fromTo(
          scrollRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1 },
          '-=0.5'
        );

      // Parallax Effect
      gsap.to(videoRef.current, {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Content fade out on scroll
      gsap.to(contentRef.current, {
        y: -100,
        opacity: 0,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom 40%',
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Video Background */}
      <div ref={videoRef} className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-black/40 z-10" /> {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 z-10" />

        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=80"
        >
          {/* Using a high-quality luxury real estate placeholder video */}
          <source
            src="https://videos.pexels.com/video-files/3773487/3773487-uhd_2560_1440_25fps.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="container mx-auto px-4 z-20 relative">
        <div ref={contentRef} className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8">
            <span className="w-1.5 h-1.5 bg-accent-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
            <span className="text-sm font-medium text-white tracking-wide uppercase">
              Exclusive Living in Saidia Bay
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white leading-tight mb-6 drop-shadow-lg">
            Experience the Art of
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-primary-200">
              Luxury Living
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto mb-12 font-light leading-relaxed drop-shadow-md">
            Discover a curated collection of the most exquisite villas, apartments, and penthouses.
            Your sanctuary awaits in the heart of the Mediterranean.
          </p>

          {/* Search Component */}
          <div className="w-full">
            <HeroSearch />
          </div>

          {/* Quick Stats */}
          <div className="hidden md:flex justify-center gap-12 mt-16 text-white/90">
            <div>
              <p className="text-3xl font-heading font-bold">500+</p>
              <p className="text-sm text-primary-200 uppercase tracking-widest text-[10px]">Premium Listings</p>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div>
              <p className="text-3xl font-heading font-bold">150+</p>
              <p className="text-sm text-primary-200 uppercase tracking-widest text-[10px]">Awards Won</p>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div>
              <p className="text-3xl font-heading font-bold">12k+</p>
              <p className="text-sm text-primary-200 uppercase tracking-widest text-[10px]">Happy Guests</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white z-20 flex flex-col items-center gap-2 cursor-pointer hover:text-accent-400 transition-colors"
        onClick={() => {
          const nextSection = document.getElementById('featured-properties') || document.querySelector('section:nth-of-type(2)');
          nextSection?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Discover More</span>
        <FiArrowDown className="w-5 h-5 animate-bounce" />
      </div>
    </section>
  );
};

export default HeroSection;
