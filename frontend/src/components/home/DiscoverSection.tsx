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
    description: 'Villas privées luxueuses',
  },
  {
    id: 'apartment',
    title: 'Appartements',
    count: '120+',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600',
    description: 'Appartements urbains modernes',
  },
  {
    id: 'house',
    title: 'Maisons',
    count: '80+',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600',
    description: 'Maisons familiales',
  },
  {
    id: 'studio',
    title: 'Studios',
    count: '65+',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600',
    description: 'Espaces de vie compacts',
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
    <section ref={sectionRef} className="relative py-20 lg:py-32 overflow-hidden">
      {/* Premium Background with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-950 via-primary-900 to-primary-950" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-950/50 via-transparent to-primary-950/50" />
      
      <div className="relative container mx-auto px-4 lg:px-6">
        {/* Header */}
        <div ref={titleRef} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            {/* Brand Label - Matching Hero */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-px bg-accent-500" />
              <span className="text-accent-400 text-sm font-medium tracking-[0.2em] uppercase">
                Explorer
              </span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-medium leading-[1.1] mb-4">
              Découvrir par <span className="text-accent-400">Catégorie</span>
            </h2>
            <p className="text-lg md:text-xl text-white/80 max-w-xl leading-relaxed">
              Trouvez le type de bien parfait correspondant à votre style de vie et vos préférences
            </p>
          </div>
          <Link
            href="/properties"
            className="inline-flex items-center gap-3 px-8 py-4 border-2 border-white/30 text-white font-medium rounded-lg hover:bg-white/10 hover:border-white/50 transition-all group"
          >
            Voir Toutes les Propriétés
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

              {/* Premium Overlay - Matching Hero */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary-950/90 via-primary-900/60 to-primary-900/30" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-950/50 via-transparent to-primary-950/50" />

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="transform transition-transform duration-300 group-hover:translate-y-[-8px]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                      {category.count} disponibles
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl font-medium text-white mb-2">
                    {category.title}
                  </h3>
                  <p className="text-white/90 text-sm md:text-base leading-relaxed">
                    {category.description}
                  </p>
                </div>

                {/* Arrow */}
                <div className="absolute bottom-6 right-6 w-12 h-12 bg-accent-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 shadow-gold">
                  <FiArrowRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

