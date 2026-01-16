'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiCheck, FiArrowRight } from 'react-icons/fi';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
  'Propriétés de luxe vérifiées',
  'Expertise du marché',
  'Service personnalisé',
  'Support juridique & financier',
  'Gestion immobilière',
  'Conseil en investissement',
];

const stats = [
  { icon: FiTrendingUp, value: '500+', label: 'Propriétés', color: 'bg-primary-100 text-primary-700' },
  { icon: FiUsers, value: '1.2K+', label: 'Clients', color: 'bg-accent-100 text-accent-700' },
  { icon: FiAward, value: '10+', label: 'Années', color: 'bg-success-100 text-success-700' },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        [imageRef.current, contentRef.current],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
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
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Image */}
          <div ref={imageRef} className="relative">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
              <Image
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=85"
                alt="Luxury Property"
                fill
                className="object-cover"
              />

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-luxury hover:scale-110 transition-transform group">
                  <FiPlay className="w-8 h-8 text-primary-900 ml-1" />
                </button>
              </div>
            </div>

            {/* Floating Card */}
            <div className="absolute -bottom-8 -right-8 bg-white rounded-2xl shadow-luxury-xl p-6 max-w-[200px] hidden lg:block">
              <div className="text-4xl font-heading font-bold text-primary-900 mb-1">
                98%
              </div>
              <p className="text-secondary-600 text-sm">
                Taux de Satisfaction Client
              </p>
            </div>
          </div>

          {/* Content */}
          <div ref={contentRef}>
            <p className="text-accent-600 font-semibold text-sm uppercase tracking-wider mb-3">
              À Propos de Nous
            </p>
            <h2 className="text-4xl lg:text-5xl font-heading font-bold text-secondary-900 leading-tight mb-6">
              Votre Partenaire de Confiance en
              <span className="text-primary-700"> Immobilier de Luxe</span>
            </h2>

            <p className="text-lg text-secondary-600 mb-8 leading-relaxed">
              Avec plus d'une décennie d'expertise sur le marché immobilier de Saidia Bay, nous avons aidé
              des milliers de clients à trouver la maison de leurs rêves et à prendre des décisions d'investissement judicieuses.
            </p>

            {/* Features */}
            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-secondary-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiCheck className="text-white w-3 h-3" />
                  </div>
                  <span className="text-sm text-secondary-700">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-10">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-primary-900 font-semibold hover:gap-4 transition-all"
              >
                En Savoir Plus Sur Nous
                <span className="text-xl">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
