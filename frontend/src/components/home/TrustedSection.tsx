'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const partners = [
  { name: 'coinbase', color: '#0052FF' },
  { name: 'Airtable', color: '#18BFFF' },
  { name: 'pendo', color: '#FF407B' },
  { name: 'treehouse', color: '#57B846' },
];

export default function TrustedSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-8 border-y border-secondary-100 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-center gap-8 lg:gap-16 flex-wrap">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex items-center gap-2 text-secondary-400 hover:text-secondary-600 transition-colors cursor-pointer"
            >
              <div
                className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: partner.color }}
              >
                {partner.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
