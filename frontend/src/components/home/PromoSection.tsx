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
    title: 'Remise Spéciale',
    subtitle: 'Pour les Primo-Accédants',
    discount: '20%',
    description: 'Obtenez une remise exclusive sur votre premier achat immobilier',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    cta: 'En Savoir Plus',
    color: 'from-primary-900 to-primary-700',
  },
  {
    id: 2,
    title: 'Offres de Location',
    subtitle: 'Saison Estivale',
    discount: '30%',
    description: 'Réservez maintenant pour vos locations de vacances d\'été',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    cta: 'Réserver',
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
    <section ref={sectionRef} className="relative py-20 lg:py-32 overflow-hidden">
      {/* Premium Background with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-950 via-primary-900 to-primary-950" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-950/50 via-transparent to-primary-950/50" />
      
      <div className="relative container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between mb-16">
          <div>
            {/* Brand Label - Matching Hero */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-px bg-accent-500" />
              <span className="text-accent-400 text-sm font-medium tracking-[0.2em] uppercase">
                Offres Spéciales
              </span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-medium leading-[1.1]">
              Obtenez des Offres <span className="text-accent-400">Exclusives</span>
            </h2>
          </div>
          <Link
            href="/properties"
            className="hidden md:inline-flex items-center gap-3 px-8 py-4 border-2 border-white/30 text-white font-medium rounded-lg hover:bg-white/10 hover:border-white/50 transition-all group"
          >
            Voir Toutes les Offres
            <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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

              {/* Premium Gradient Overlay - Matching Hero */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-950/85 via-primary-900/75 to-primary-900/65" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-950/60 via-transparent to-primary-950/30" />

              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-between text-white">
                <div>
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium mb-4">
                    {promo.subtitle}
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl font-medium mb-2">
                    {promo.title}
                  </h3>
                  <p className="text-white/90 max-w-xs leading-relaxed">
                    {promo.description}
                  </p>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-6xl md:text-7xl font-heading font-bold">
                      {promo.discount}
                    </span>
                    <span className="text-2xl font-semibold ml-1">DE RÉDUCTION</span>
                  </div>

                  <Link
                    href="/properties"
                    className="group flex items-center gap-2 px-6 py-3 bg-accent-500 text-white rounded-full font-medium hover:bg-accent-600 transition-all shadow-gold"
                  >
                    {promo.cta}
                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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

