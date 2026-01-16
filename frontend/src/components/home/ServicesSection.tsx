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
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current?.children || [],
        { opacity: 0, y: 20 },
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
    <section ref={sectionRef} className="py-16 lg:py-20 bg-secondary-50/50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div ref={titleRef} className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-accent-600 font-semibold text-sm uppercase tracking-wider mb-3">
            Nos Services
          </p>
          <h2 className="text-4xl lg:text-5xl font-heading font-bold text-secondary-900 mb-4">
            Ce Que Nous Offrons
          </h2>
          <p className="text-lg text-secondary-600">
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
                className="group bg-white p-6 rounded-xl border border-secondary-100 hover:border-secondary-200 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-secondary-900 group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-semibold text-secondary-900 mb-3 group-hover:text-primary-700 transition-colors">
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
