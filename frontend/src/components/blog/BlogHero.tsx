'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function BlogHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Elegant Parallax Effect
            gsap.to(imageRef.current, {
                yPercent: 30,
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                },
            });

            // Subtle Fade In for Content
            gsap.fromTo(contentRef.current,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.2 }
            );

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">

            {/* --- Background Image with Parallax --- */}
            <div ref={imageRef} className="absolute inset-0 w-full h-[120%] -top-[10%] pointer-events-none">
                <Image
                    src="/images/about/marina.jpg"
                    alt="Saidia Bay Lifestyle"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Sophisticated Overlay: Darker with Inset Shadow */}
                <div className="absolute inset-0 bg-primary-950/60" />
                <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)] pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/60 to-transparent opacity-90" />
            </div>

            {/* --- Editorial Content --- */}
            <div ref={contentRef} className="relative z-10 container mx-auto px-6 text-center text-white">

                {/* Kicker */}
                <p className="text-secondary-200 text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-6 opacity-80">
                    Magazine & Lifestyle
                </p>

                {/* Main Title - Serif & Elegant */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-light mb-8 leading-tight">
                    Le Journal <br />
                    <span className="italic font-serif text-white/90">Saidia Bay</span>
                </h1>

                {/* Divider */}
                <div className="w-24 h-[1px] bg-white/30 mx-auto mb-8" />

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-secondary-100 max-w-2xl mx-auto font-light leading-relaxed opacity-90">
                    Immersion dans l'élégance méditerranéenne. Actualités immobilières, architecture et art de vivre sur la Perle Bleue.
                </p>

            </div>
        </div>
    );
}
