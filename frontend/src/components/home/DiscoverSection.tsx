'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowRight, FiHome, FiLayers, FiGrid, FiSquare } from 'react-icons/fi';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    id: 'villa',
    title: 'Villas',
    count: '12,904',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=85',
    icon: FiHome,
  },
  {
    id: 'apartment',
    title: 'Apartments',
    count: '10,627',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=85',
    icon: FiLayers,
  },
  {
    id: 'house',
    title: 'Resorts',
    count: '367',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=85',
    icon: FiGrid,
  },
  {
    id: 'studio',
    title: 'Cottages',
    count: '263',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=85',
    icon: FiSquare,
  },
];

export default function DiscoverSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current?.children || [],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-2xl lg:text-3xl font-semibold text-secondary-900 mb-2">
            Discover your destination
          </h2>
          <p className="text-secondary-500">
            Explore our range of property types for every traveler's preference
          </p>
        </div>

        {/* Category Cards */}
        <div ref={cardsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                href={`/properties?type=${category.id}`}
                className="group block"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="flex items-start gap-2">
                  <Icon className="w-5 h-5 text-secondary-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-secondary-900 group-hover:text-primary-700 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-sm text-secondary-500">
                      {category.count} available
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
