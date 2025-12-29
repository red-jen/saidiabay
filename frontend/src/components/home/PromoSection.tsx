'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const promos = [
  {
    id: 1,
    title: 'Special Discount',
    subtitle: 'For First-Time Buyers',
    discount: '20%',
    description: 'Get exclusive discount on your first property purchase',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    cta: 'Learn More',
    color: 'from-primary-900 to-primary-700',
  },
  {
    id: 2,
    title: 'Rental Deals',
    subtitle: 'Summer Season',
    discount: '30%',
    description: 'Book now for summer vacation rentals',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    cta: 'Book Now',
    color: 'from-accent-700 to-accent-500',
  },
];

export default function PromoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current?.children || [],
        { opacity: 0, x: (index) => (index === 0 ? -50 : 50) },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.2,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-secondary-50">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-accent-600 font-semibold text-sm uppercase tracking-wider mb-2">
              Special Offers
            </p>
            <h2 className="text-4xl lg:text-5xl font-heading font-bold text-secondary-900">
              Get Exclusive Deals
            </h2>
          </div>
          <Link
            href="/properties"
            className="hidden md:inline-flex items-center gap-2 text-primary-900 font-semibold hover:gap-4 transition-all"
          >
            See All Offers
            <FiArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-2 gap-6">
          {promos.map((promo) => (
            <div
              key={promo.id}
              className="relative h-72 md:h-80 rounded-3xl overflow-hidden group cursor-pointer"
            >
              {/* Background Image */}
              <Image
                src={promo.image}
                alt={promo.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${promo.color} opacity-90`} />
              
              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-between text-white">
                <div>
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium mb-4">
                    {promo.subtitle}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-heading font-bold mb-2">
                    {promo.title}
                  </h3>
                  <p className="text-white/80 max-w-xs">
                    {promo.description}
                  </p>
                </div>
                
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-6xl md:text-7xl font-heading font-bold">
                      {promo.discount}
                    </span>
                    <span className="text-2xl font-semibold ml-1">OFF</span>
                  </div>
                  
                  <Link
                    href="/properties"
                    className="flex items-center gap-2 px-5 py-2.5 bg-white text-primary-900 rounded-full font-semibold hover:gap-3 transition-all"
                  >
                    {promo.cta}
                    <FiArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

