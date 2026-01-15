'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight, FiPhone, FiMail } from 'react-icons/fi';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        imageRef.current,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          delay: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 rounded-[2.5rem] overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          <div className="relative grid lg:grid-cols-2 gap-12 p-10 lg:p-16 items-center">
            {/* Content */}
            <div ref={contentRef}>
              <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
                🏠 Commencez Votre Voyage Aujourd'hui
              </span>

              <h2 className="text-4xl lg:text-5xl font-heading font-bold text-white leading-tight mb-6">
                Prêt à Trouver Votre
                <br />
                <span className="text-accent-400">Propriété de Rêve ?</span>
              </h2>

              <p className="text-lg text-white/80 mb-10 max-w-lg">
                Que vous achetiez, vendiez ou louiez, notre équipe d'experts est là pour vous guider à chaque étape.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link
                  href="/properties"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-primary-900 rounded-xl font-semibold hover:bg-accent-50 transition-colors group"
                >
                  <span>Parcourir les Propriétés</span>
                  <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/30 rounded-xl font-semibold hover:bg-white/20 transition-colors"
                >
                  <FiPhone className="w-5 h-5" />
                  <span>Contactez-nous</span>
                </Link>
              </div>

              {/* Contact Info */}
              <div className="flex flex-wrap gap-6">
                <a href="tel:+212XXXXXXXX" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                  <FiPhone className="w-4 h-4" />
                  <span>+212 XXX XXX XXX</span>
                </a>
                <a href="mailto:info@saidiabay.com" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                  <FiMail className="w-4 h-4" />
                  <span>info@saidiabay.com</span>
                </a>
              </div>
            </div>

            {/* Image */}
            <div ref={imageRef} className="hidden lg:block relative">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                {/* Main Image */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                  <Image
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600"
                    alt="Luxury Home"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Floating Stats */}
                <div className="absolute -left-8 bottom-12 bg-white rounded-2xl shadow-luxury p-5 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🏠</span>
                    </div>
                    <div>
                      <div className="text-2xl font-heading font-bold text-primary-900">
                        500+
                      </div>
                      <p className="text-secondary-600 text-sm">Propriétés Listées</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-4 top-12 bg-white rounded-2xl shadow-luxury p-5 animate-float" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">⭐</span>
                    </div>
                    <div>
                      <div className="text-2xl font-heading font-bold text-primary-900">
                        4.9
                      </div>
                      <p className="text-secondary-600 text-sm">Note Client</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
