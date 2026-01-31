'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { FiHome, FiKey, FiDollarSign, FiMapPin, FiArrowRight } from 'react-icons/fi';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: FiHome,
    title: 'Acheter une Propriété',
    description: 'Trouvez la maison de vos rêves parmi notre sélection de propriétés haut de gamme à Saidia Bay.',
    link: '/properties?listingType=VENTE',
    cta: 'Parcourir les maisons',
    color: 'bg-primary-50 text-primary-600 group-hover:bg-primary-600 group-hover:text-white',
  },
  {
    icon: FiKey,
    title: 'Louer une Propriété',
    description: 'Découvrez des appartements, villas et plus pour vos prochaines vacances ou long séjour.',
    link: '/properties?listingType=LOCATION',
    cta: 'Trouver des locations',
    color: 'bg-accent-50 text-accent-600 group-hover:bg-accent-600 group-hover:text-white',
  },
  {
    icon: FiDollarSign,
    title: 'Vendre Votre Propriété',
    description: 'Listez votre bien chez nous et atteignez des milliers d\'acheteurs potentiels dans le monde entier.',
    link: '/contact',
    cta: 'Commencer',
    color: 'bg-success-50 text-success-600 group-hover:bg-success-600 group-hover:text-white',
  },
  {
    icon: FiMapPin,
    title: 'Gestion Immobilière',
    description: 'Laissez-nous gérer votre propriété pendant que vous profitez des rendements.',
    link: '/contact',
    cta: 'En savoir plus',
    color: 'bg-warning-50 text-warning-600 group-hover:bg-warning-600 group-hover:text-white',
  },
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 40 },
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

      // Cards animation
      gsap.fromTo(
        cardsRef.current?.children || [],
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
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
    <section ref={sectionRef} className="relative py-20 lg:py-32 overflow-hidden bg-white">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Header */}
        <div ref={titleRef} className="text-center max-w-3xl mx-auto mb-16">
          {/* Brand Label - Matching Hero */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-px bg-accent-500" />
            <span className="text-accent-400 text-sm font-medium tracking-[0.2em] uppercase">
              Nos Services
            </span>
            <div className="w-12 h-px bg-accent-500" />
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-primary-900 font-medium leading-[1.1] mb-4">
            Ce Que Nous <span className="text-accent-500">Offrons</span>
          </h2>
          <p className="text-lg md:text-xl text-primary-800/80 leading-relaxed">
            Tout ce dont vous avez besoin pour votre parcours immobilier en un seul endroit
          </p>
        </div>

        {/* Services Grid */}
        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Link
                key={index}
                href={service.link}
                className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-luxury transition-all duration-500 hover:-translate-y-2"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${service.color}`}>
                  <Icon className="w-7 h-7" />
                </div>

                <h3 className="font-serif text-xl md:text-2xl font-medium text-primary-900 mb-3 group-hover:text-accent-500 transition-colors">
                  {service.title}
                </h3>

                <p className="text-secondary-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                <span className="inline-flex items-center gap-2 text-primary-700 font-semibold group-hover:gap-3 transition-all">
                  {service.cta}
                  <FiArrowRight className="w-4 h-4" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
