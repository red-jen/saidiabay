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
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
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
        <div className="relative bg-secondary-900 rounded-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2 items-center">
            {/* Content */}
            <div ref={contentRef} className="p-8 lg:p-12">
              <h2 className="text-2xl lg:text-3xl font-semibold text-white mb-4">
                Ready to find your dream property?
              </h2>
              <p className="text-secondary-300 mb-8 max-w-md">
                Whether you're buying, selling, or renting, our expert team is here to guide you every step of the way.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  href="/properties"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-secondary-900 rounded-lg font-medium hover:bg-secondary-100 transition-colors"
                >
                  Browse Properties
                  <FiArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/30 text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
                >
                  Contact Us
                </Link>
              </div>

              {/* Contact Info */}
              <div className="flex flex-wrap gap-6 text-sm">
                <a href="tel:+212661234567" className="flex items-center gap-2 text-secondary-400 hover:text-white transition-colors">
                  <FiPhone className="w-4 h-4" />
                  <span>+212 661 234 567</span>
                </a>
                <a href="mailto:contact@saidiabay.com" className="flex items-center gap-2 text-secondary-400 hover:text-white transition-colors">
                  <FiMail className="w-4 h-4" />
                  <span>contact@saidiabay.com</span>
                </a>
              </div>
            </div>

            {/* Image */}
            <div className="relative h-64 lg:h-full lg:min-h-[400px]">
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=85"
                alt="Luxury Property"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
