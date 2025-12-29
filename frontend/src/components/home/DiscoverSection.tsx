'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    id: 'villa',
    title: 'Villas',
    count: '45+',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600',
    description: 'Luxurious private villas',
  },
  {
    id: 'apartment',
    title: 'Apartments',
    count: '120+',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600',
    description: 'Modern city apartments',
  },
  {
    id: 'house',
    title: 'Houses',
    count: '80+',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600',
    description: 'Family-friendly homes',
  },
  {
    id: 'studio',
    title: 'Studios',
    count: '65+',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600',
    description: 'Compact living spaces',
  },
];

export default function DiscoverSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards stagger animation
      gsap.fromTo(
        cardsRef.current?.children || [],
        { opacity: 0, y: 60, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
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
        {/* Header */}
        <div ref={titleRef} className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-accent-600 font-semibold text-sm uppercase tracking-wider mb-2">
              Explore
            </p>
            <h2 className="text-4xl lg:text-5xl font-heading font-bold text-secondary-900">
              Discover by Category
            </h2>
            <p className="text-secondary-600 mt-3 max-w-lg">
              Find the perfect property type that matches your lifestyle and preferences
            </p>
          </div>
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-primary-900 font-semibold hover:gap-4 transition-all group"
          >
            View All Properties
            <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Cards */}
        <div ref={cardsRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/properties?type=${category.id}`}
              className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer"
            >
              {/* Image */}
              <Image
                src={category.image}
                alt={category.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="transform transition-transform duration-300 group-hover:translate-y-[-8px]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                      {category.count} available
                    </span>
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-white mb-1">
                    {category.title}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {category.description}
                  </p>
                </div>
                
                {/* Arrow */}
                <div className="absolute bottom-6 right-6 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                  <FiArrowRight className="w-5 h-5 text-primary-900" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

