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
    description: 'Find your dream home from our curated selection of premium properties.',
    link: '/properties?listingType=VENTE',
  },
  {
    icon: FiKey,
    title: 'Rent a Property',
    description: 'Discover apartments and villas for your next vacation or long-term stay.',
    link: '/properties?listingType=LOCATION',
  },
  {
    icon: FiDollarSign,
    title: 'Sell Your Property',
    description: 'List your property and reach thousands of potential buyers worldwide.',
    link: '/contact',
  },
  {
    icon: FiMapPin,
    title: 'Property Management',
    description: 'Let us handle your property management while you enjoy the returns.',
    link: '/contact',
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
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl lg:text-3xl font-semibold text-secondary-900 mb-3">
            Our Services
          </h2>
          <p className="text-secondary-500">
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
                className="group bg-white p-6 rounded-xl border border-secondary-100 hover:border-secondary-200 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-secondary-900 group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="font-semibold text-secondary-900 mb-2 group-hover:text-primary-700 transition-colors">
                  {service.title}
                </h3>

                <p className="text-sm text-secondary-500 leading-relaxed mb-4">
                  {service.description}
                </p>

                <span className="inline-flex items-center gap-1 text-sm font-medium text-secondary-700 group-hover:text-primary-700 transition-colors">
                  Learn more
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
