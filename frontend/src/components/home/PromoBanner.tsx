'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { FiX, FiArrowRight, FiPercent, FiStar } from 'react-icons/fi';
import gsap from 'gsap';

interface Promo {
    id: number;
    text: string;
    highlight: string;
    link: string;
    linkText: string;
    icon: React.ElementType;
    bgColor: string;
}

const promos: Promo[] = [
    {
        id: 1,
        text: 'Offre Exclusive :',
        highlight: '-15% sur les frais d\'agence',
        link: '/properties?discount=true',
        linkText: 'En profiter',
        icon: FiPercent,
        bgColor: 'from-accent-600 to-accent-500',
    },
    {
        id: 2,
        text: 'Nouveauté :',
        highlight: '12 nouvelles villas disponibles',
        link: '/properties?type=villa&sort=newest',
        linkText: 'Découvrir',
        icon: FiStar,
        bgColor: 'from-primary-700 to-primary-600',
    },
];

export default function PromoBanner() {
    const bannerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(true);
    const [currentPromo, setCurrentPromo] = useState(0);

    useEffect(() => {
        // Check if banner was dismissed in this session
        const dismissed = sessionStorage.getItem('promoBannerDismissed');
        if (dismissed) setIsVisible(false);
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        const ctx = gsap.context(() => {
            // Initial animation
            gsap.fromTo(bannerRef.current,
                { yPercent: -100, opacity: 0 },
                { yPercent: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.5 }
            );

            // Content shimmer effect
            gsap.fromTo('.promo-highlight',
                { backgroundPosition: '-200% 0' },
                {
                    backgroundPosition: '200% 0',
                    duration: 3,
                    ease: 'linear',
                    repeat: -1,
                    repeatDelay: 2
                }
            );
        }, bannerRef);

        // Rotate promos
        const interval = setInterval(() => {
            setCurrentPromo(prev => (prev + 1) % promos.length);
        }, 5000);

        return () => {
            ctx.revert();
            clearInterval(interval);
        };
    }, [isVisible]);

    useEffect(() => {
        if (!contentRef.current || !isVisible) return;

        gsap.fromTo(contentRef.current,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
        );
    }, [currentPromo, isVisible]);

    const handleDismiss = () => {
        gsap.to(bannerRef.current, {
            yPercent: -100,
            opacity: 0,
            duration: 0.4,
            ease: 'power3.in',
            onComplete: () => {
                setIsVisible(false);
                sessionStorage.setItem('promoBannerDismissed', 'true');
            }
        });
    };

    if (!isVisible) return null;

    const promo = promos[currentPromo];
    const IconComponent = promo.icon;

    return (
        <div
            ref={bannerRef}
            className={`relative z-50 bg-gradient-to-r ${promo.bgColor} text-white py-3 px-4 transition-colors duration-500`}
        >
            <div className="container mx-auto">
                <div className="flex items-center justify-center gap-4">
                    {/* Icon */}
                    <div className="hidden sm:flex items-center justify-center w-8 h-8 bg-white/20 rounded-full backdrop-blur-sm">
                        <IconComponent className="w-4 h-4" />
                    </div>

                    {/* Content */}
                    <div ref={contentRef} className="flex items-center gap-2 text-sm md:text-base">
                        <span className="font-medium">{promo.text}</span>
                        <span
                            className="promo-highlight font-bold bg-gradient-to-r from-white via-accent-100 to-white bg-clip-text text-transparent bg-[length:200%_100%]"
                        >
                            {promo.highlight}
                        </span>
                    </div>

                    {/* CTA Link */}
                    <Link
                        href={promo.link}
                        className="hidden md:inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-sm font-semibold transition-all hover:scale-105 backdrop-blur-sm"
                    >
                        {promo.linkText}
                        <FiArrowRight className="w-4 h-4" />
                    </Link>

                    {/* Progress Dots */}
                    <div className="hidden sm:flex items-center gap-1.5 ml-4">
                        {promos.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentPromo(idx)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentPromo ? 'bg-white w-4' : 'bg-white/40 hover:bg-white/60'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={handleDismiss}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                        aria-label="Fermer la bannière"
                    >
                        <FiX className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
