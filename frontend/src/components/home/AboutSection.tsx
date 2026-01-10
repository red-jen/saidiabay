'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiCheck, FiArrowRight } from 'react-icons/fi';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
  'Verified luxury properties',
  'Expert market knowledge',
  'Personalized service',
  'Legal & financial support',
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
            </div>

            {/* Floating Badge */}
            <div className="absolute bottom-4 right-4 bg-white rounded-xl shadow-lg px-4 py-3">
              <p className="text-2xl font-bold text-secondary-900">98%</p>
              <p className="text-xs text-secondary-500">Client Satisfaction</p>
            </div>
          </div>

          {/* Content */}
          <div ref={contentRef}>
            <p className="text-sm font-medium text-primary-600 mb-2">ABOUT US</p>
            <h2 className="text-2xl lg:text-3xl font-semibold text-secondary-900 mb-4">
              Beyond accommodation, creating memories of a lifetime
            </h2>

            <p className="text-secondary-600 mb-6 leading-relaxed">
              With over a decade of expertise in Saidia Bay's premium property market, we've helped
              thousands of clients discover their dream homes and make sound investment decisions.
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
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-secondary-900 font-medium hover:text-primary-700 transition-colors"
            >
              Learn More
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
