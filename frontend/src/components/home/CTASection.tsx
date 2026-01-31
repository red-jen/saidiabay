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

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax effect for background
      gsap.to('.cta-bg', {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });

      // Content Reveal
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="relative rounded-[3rem] overflow-hidden shadow-2xl min-h-[500px] flex items-center justify-center text-center">

          {/* Background Image with Parallax */}
          <div className="absolute inset-0 -z-10">
            <Image
              src="/images/about/hero.jpg"
              alt="Saidia Bay Luxury View"
              fill
              className="cta-bg object-cover scale-110"
            />
            {/* Premium Overlay - Matching Hero */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-950/85 via-primary-900/75 to-primary-900/65" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-950/60 via-transparent to-primary-950/30" />
          </div>

          <div ref={contentRef} className="relative z-10 px-6 max-w-4xl mx-auto py-20">
            <span className="inline-block px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-xs font-bold tracking-[0.2em] uppercase mb-8 border border-white/20">
              Commencez Votre Voyage
            </span>

            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-medium leading-[1.1] mb-8">
              Prêt à Vivre le <br />
              <span className="text-accent-400">Rêve Méditerranéen ?</span>
            </h2>

            <p className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Que vous cherchiez une résidence secondaire ou un investissement stratégique,
              Saidia Bay vous ouvre ses portes. Laissez-nous vous guider.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/properties"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-accent-500 text-white font-medium rounded-lg hover:bg-accent-600 transition-all shadow-gold"
              >
                Explorer les Propriétés
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-medium rounded-lg hover:bg-white/10 hover:border-white/50 transition-all"
              >
                Nous Contacter
              </Link>
            </div>

            <div className="mt-16 flex justify-center gap-8 text-white/60 text-sm tracking-wider uppercase">
              <div className="flex items-center gap-2">
                <FiPhone className="w-4 h-4" />
                <span>Casablanca</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-white/60 rounded-full" />
                <span>Oujda</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-white/60 rounded-full" />
                <span>Saidia</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
