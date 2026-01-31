'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { HiOutlineHomeModern, HiOutlineKey, HiOutlineCurrencyDollar, HiOutlineBuildingOffice2 } from 'react-icons/hi2';
import { MdOutlineRealEstateAgent, MdOutlineVilla, MdOutlineSell, MdOutlineManageAccounts } from 'react-icons/md';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: HiOutlineHomeModern,
    title: 'Acheter une Propriété',
    description: 'Trouvez la maison de vos rêves parmi notre sélection de propriétés haut de gamme à Saidia Bay.',
    link: '/properties?listingType=VENTE',
    cta: 'Parcourir les maisons',
    gradient: 'from-primary-900 to-primary-700',
    iconBg: 'bg-primary-900/10 text-primary-900 group-hover:bg-primary-900 group-hover:text-white',
  },
  {
    icon: HiOutlineKey,
    title: 'Louer une Propriété',
    description: 'Découvrez des appartements, villas et plus pour vos prochaines vacances ou long séjour.',
    link: '/properties?listingType=LOCATION',
    cta: 'Trouver des locations',
    gradient: 'from-accent-600 to-accent-500',
    iconBg: 'bg-accent-500/10 text-accent-600 group-hover:bg-accent-500 group-hover:text-white',
  },
  {
    icon: MdOutlineSell,
    title: 'Vendre Votre Propriété',
    description: 'Listez votre bien chez nous et atteignez des milliers d\'acheteurs potentiels dans le monde entier.',
    link: '/contact',
    cta: 'Commencer',
    gradient: 'from-primary-800 to-primary-600',
    iconBg: 'bg-primary-800/10 text-primary-800 group-hover:bg-primary-800 group-hover:text-white',
  },
  {
    icon: MdOutlineManageAccounts,
    title: 'Gestion Immobilière',
    description: 'Laissez-nous gérer votre propriété pendant que vous profitez des rendements.',
    link: '/contact',
    cta: 'En savoir plus',
    gradient: 'from-accent-700 to-accent-600',
    iconBg: 'bg-accent-600/10 text-accent-700 group-hover:bg-accent-600 group-hover:text-white',
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
    <section ref={sectionRef} className="relative py-20 lg:py-32 overflow-hidden">
      {/* Premium Background with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-secondary-50/50 to-white" />
      
      <div className="relative container mx-auto px-4 lg:px-6">
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
        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Link
                key={index}
                href={service.link}
                className="group relative bg-white p-8 rounded-2xl shadow-elegant hover:shadow-elegant-lg transition-all duration-500 hover:-translate-y-2 border border-secondary-100 overflow-hidden"
              >
                {/* Premium Gradient Accent */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Icon Container - Luxury Style */}
                <div className={`relative w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${service.iconBg} shadow-elegant group-hover:scale-110`}>
                  <Icon className="w-8 h-8" />
                  {/* Decorative corner accent */}
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-500/20 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <h3 className="font-serif text-xl md:text-2xl font-medium text-primary-900 mb-3 group-hover:text-accent-500 transition-colors">
                  {service.title}
                </h3>

                <p className="text-primary-800/70 mb-6 leading-relaxed text-sm md:text-base">
                  {service.description}
                </p>

                <span className="inline-flex items-center gap-2 text-primary-900 font-medium group-hover:text-accent-500 group-hover:gap-3 transition-all">
                  {service.cta}
                  <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
