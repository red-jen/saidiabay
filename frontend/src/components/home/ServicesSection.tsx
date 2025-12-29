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
    title: 'Buy a Property',
    description: 'Find your dream home from our curated selection of premium properties in Saidia Bay.',
    link: '/properties?listingType=VENTE',
    cta: 'Browse homes',
    color: 'bg-primary-50 text-primary-600 group-hover:bg-primary-600 group-hover:text-white',
  },
  {
    icon: FiKey,
    title: 'Rent a Property',
    description: 'Discover apartments, villas, and more for your next vacation or long-term stay.',
    link: '/properties?listingType=LOCATION',
    cta: 'Find rentals',
    color: 'bg-accent-50 text-accent-600 group-hover:bg-accent-600 group-hover:text-white',
  },
  {
    icon: FiDollarSign,
    title: 'Sell Your Property',
    description: 'List your property with us and reach thousands of potential buyers worldwide.',
    link: '/contact',
    cta: 'Get started',
    color: 'bg-success-50 text-success-600 group-hover:bg-success-600 group-hover:text-white',
  },
  {
    icon: FiMapPin,
    title: 'Property Management',
    description: 'Let us handle your property management while you enjoy the returns.',
    link: '/contact',
    cta: 'Learn more',
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
    <section ref={sectionRef} className="py-20 lg:py-28 bg-secondary-50">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Header */}
        <div ref={titleRef} className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-accent-600 font-semibold text-sm uppercase tracking-wider mb-3">
            Our Services
          </p>
          <h2 className="text-4xl lg:text-5xl font-heading font-bold text-secondary-900 mb-4">
            What We Offer
          </h2>
          <p className="text-lg text-secondary-600">
            Everything you need for your real estate journey in one place
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
