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
    <section ref={sectionRef} className="py-16 border-y border-secondary-100">
      <div className="container mx-auto px-4 lg:px-6">
        <p className="text-center text-secondary-500 text-sm uppercase tracking-wider mb-8">
          Reconnu par les Leaders de l'Industrie
        </p>
        <div
          ref={logosRef}
          className="flex flex-wrap items-center justify-center gap-8 md:gap-16"
        >
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex items-center gap-2 text-secondary-400 hover:text-secondary-700 transition-colors cursor-pointer group"
            >
              <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">
                {partner.logo}
              </span>
              <span className="text-lg font-semibold">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

