'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiCheck, FiPlay, FiAward, FiUsers, FiTrendingUp, FiArrowRight, FiX } from 'react-icons/fi';
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
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image animation
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, x: -80 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          scrollTrigger: {
            trigger: imageRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Content animation
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, x: 80 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Close video on Escape key and manage body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsVideoOpen(false);
      }
    };

    if (isVideoOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isVideoOpen]);

  return (
    <>
    <section ref={sectionRef} className="relative py-20 lg:py-32 overflow-hidden">
      {/* Premium Background with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-secondary-50 to-white" />
      
      <div className="relative container mx-auto px-4 lg:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Images */}
          <div ref={imageRef} className="relative">
            {/* Main Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-elegant-lg aspect-[4/3]">
              <Image
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
                alt="Luxury Property"
                fill
                className="object-cover"
              />
              
              {/* Premium Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary-950/40 via-transparent to-transparent" />

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button 
                  onClick={() => setIsVideoOpen(true)}
                  className="w-20 h-20 bg-accent-500 rounded-full flex items-center justify-center shadow-gold hover:scale-110 transition-transform group"
                  aria-label="Play video"
                >
                  <FiPlay className="w-8 h-8 text-white ml-1" />
                </button>
              </div>
            </div>

            {/* Floating Card */}
            <div className="absolute -bottom-8 -right-8 bg-primary-900 rounded-2xl shadow-elegant-xl p-6 max-w-[200px] hidden lg:block">
              <div className="text-4xl font-serif font-medium text-accent-400 mb-1">
                98%
              </div>
              <p className="text-white/80 text-sm">
                Taux de Satisfaction Client
              </p>
            </div>

            {/* Background Shape */}
            <div className="absolute -z-10 -top-6 -left-6 w-full h-full bg-accent-100/50 rounded-3xl" />
          </div>

          {/* Content */}
          <div ref={contentRef}>
            {/* Brand Label - Matching Hero */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-px bg-accent-500" />
              <span className="text-accent-400 text-sm font-medium tracking-[0.2em] uppercase">
                À Propos de Nous
              </span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-primary-900 font-medium leading-[1.1] mb-6">
              Votre Partenaire de Confiance en <span className="text-accent-500">Immobilier de Luxe</span>
            </h2>

            <p className="text-lg md:text-xl text-primary-800/80 mb-8 leading-relaxed">
              Avec plus d'une décennie d'expertise sur le marché immobilier de Saidia Bay, nous avons aidé
              des milliers de clients à trouver la maison de leurs rêves et à prendre des décisions d'investissement judicieuses.
            </p>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 group">
                  <div className="w-6 h-6 bg-primary-900 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <FiCheck className="text-white w-3 h-3" />
                  </div>
                  <span className="text-secondary-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex gap-6 pt-8 border-t border-secondary-200">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-2xl font-heading font-bold text-secondary-900 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs text-secondary-500 uppercase tracking-wide">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="mt-10">
              <Link
                href="/about"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-accent-500 text-white font-medium rounded-lg hover:bg-accent-600 transition-all shadow-gold"
              >
                En Savoir Plus Sur Nous
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Video Modal */}
    {isVideoOpen && (
      <div 
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={() => setIsVideoOpen(false)}
      >
        <div className="relative w-full max-w-5xl mx-4">
          {/* Close Button */}
          <button
            onClick={() => setIsVideoOpen(false)}
            className="absolute -top-12 right-0 w-10 h-10 flex items-center justify-center text-white hover:text-accent-500 transition-colors rounded-full hover:bg-white/10"
            aria-label="Close video"
          >
            <FiX className="w-6 h-6" />
          </button>

          {/* Video Container */}
          <div 
            className="relative w-full bg-black rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
            style={{ paddingBottom: '56.25%' }} // 16:9 aspect ratio
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/TEXgDhT4kJ0?si=50hQKiDFCu95xajY&autoplay=1"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>

          {/* Helper Text */}
          <p className="text-center text-white/60 text-sm mt-4">
            Appuyez sur <kbd className="px-2 py-1 bg-white/10 rounded">Échap</kbd> pour fermer
          </p>
        </div>
      </div>
    )}
    </>
  );
}
