'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const partners = [
  { name: 'Airbnb', logo: '🏠' },
  { name: 'Booking', logo: '🌍' },
  { name: 'Expedia', logo: '✈️' },
  { name: 'TripAdvisor', logo: '🦉' },
  { name: 'Hotels.com', logo: '🏨' },
  { name: 'Vrbo', logo: '🏡' },
];

export default function TrustedSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const logosRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        logosRef.current?.children || [],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          scrollTrigger: {
            trigger: logosRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-16 lg:py-20 overflow-hidden bg-white border-y border-secondary-200">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Brand Label - Matching Hero */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-px bg-accent-500" />
          <span className="text-accent-400 text-sm font-medium tracking-[0.2em] uppercase">
            Reconnu par les Leaders de l'Industrie
          </span>
          <div className="w-12 h-px bg-accent-500" />
        </div>
        <div
          ref={logosRef}
          className="flex flex-wrap items-center justify-center gap-8 md:gap-16"
        >
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex items-center gap-2 text-primary-700 hover:text-accent-500 transition-colors cursor-pointer group"
            >
              <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">
                {partner.logo}
              </span>
              <span className="text-lg font-medium">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

