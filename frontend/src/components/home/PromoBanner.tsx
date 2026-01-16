'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiX, FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import gsap from 'gsap';

interface Ad {
    id: number;
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    image: string;
    bgColor: string;
    textColor: 'light' | 'dark';
}

// Configuration des publicités partenaires
const ads: Ad[] = [
    {
        id: 1,
        title: 'Partenaire Premium',
        subtitle: 'Découvrez les offres exclusives de nos partenaires de confiance',
        ctaText: 'En savoir plus',
        ctaLink: '/partners',
        image: '/images/ads/partner-1.jpg', // Remplacez par l'image du partenaire
        bgColor: 'from-primary-900 to-primary-800',
        textColor: 'light',
    },
    {
        id: 2,
        title: 'Financement Immobilier',
        subtitle: 'Taux préférentiels avec notre banque partenaire',
        ctaText: 'Simuler mon prêt',
        ctaLink: '/financing',
        image: '/images/ads/partner-2.jpg', // Remplacez par l'image du partenaire
        bgColor: 'from-accent-600 to-accent-500',
        textColor: 'light',
    },
];

export default function PromoBanner() {
    const bannerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(true);
    const [currentAd, setCurrentAd] = useState(0);
    const [imageError, setImageError] = useState<boolean[]>(new Array(ads.length).fill(false));

    // Banner always shows on page load/refresh - no session storage check

    useEffect(() => {
        if (!isVisible) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(bannerRef.current,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.3 }
            );
        }, bannerRef);

        // Auto-rotate ads
        const interval = setInterval(() => {
            setCurrentAd(prev => (prev + 1) % ads.length);
        }, 8000);

        return () => {
            ctx.revert();
            clearInterval(interval);
        };
    }, [isVisible]);

    const handleDismiss = () => {
        gsap.to(bannerRef.current, {
            opacity: 0,
            y: -20,
            duration: 0.4,
            ease: 'power3.in',
            onComplete: () => {
                setIsVisible(false);

                // Re-show after 1 minute (60000ms)
                setTimeout(() => {
                    setIsVisible(true);
                }, 60000);
            }
        });
    };

    const nextAd = () => setCurrentAd(prev => (prev + 1) % ads.length);
    const prevAd = () => setCurrentAd(prev => (prev - 1 + ads.length) % ads.length);

    const handleImageError = (index: number) => {
        setImageError(prev => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
        });
    };

    if (!isVisible) return null;

    const ad = ads[currentAd];
    const hasImage = !imageError[currentAd];

    return (
        <div
            ref={bannerRef}
            className="relative z-40 mt-[72px] lg:mt-[88px]" // Espace sous la navbar
        >
            <div className={`relative h-[200px] md:h-[280px] lg:h-[320px] overflow-hidden bg-gradient-to-r ${ad.bgColor}`}>

                {/* Background Image */}
                {hasImage && (
                    <div className="absolute inset-0">
                        <Image
                            src={ad.image}
                            alt={ad.title}
                            fill
                            className="object-cover"
                            onError={() => handleImageError(currentAd)}
                            priority
                        />
                        <div className="absolute inset-0 bg-black/40" />
                    </div>
                )}

                {/* Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

                {/* Content */}
                <div className="relative container mx-auto h-full px-6 flex items-center">
                    <div className="max-w-xl">
                        <span className="inline-block px-3 py-1 mb-4 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold uppercase tracking-wider text-white/90">
                            Publicité
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-4 leading-tight">
                            {ad.title}
                        </h2>
                        <p className="text-lg md:text-xl text-white/90 mb-6 max-w-md">
                            {ad.subtitle}
                        </p>
                        <Link
                            href={ad.ctaLink}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-900 rounded-full font-bold text-sm hover:bg-primary-50 transition-all hover:scale-105 shadow-lg"
                        >
                            {ad.ctaText}
                            <FiArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                {/* Navigation Arrows */}
                {ads.length > 1 && (
                    <>
                        <button
                            onClick={prevAd}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all"
                            aria-label="Publicité précédente"
                        >
                            <FiChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={nextAd}
                            className="absolute right-14 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all"
                            aria-label="Publicité suivante"
                        >
                            <FiChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}

                {/* Progress Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                    {ads.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentAd(idx)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentAd ? 'bg-white w-8' : 'bg-white/40 w-4 hover:bg-white/60'
                                }`}
                            aria-label={`Aller à la publicité ${idx + 1}`}
                        />
                    ))}
                </div>

                {/* Close Button */}
                <button
                    onClick={handleDismiss}
                    className="absolute top-4 right-4 w-8 h-8 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all"
                    aria-label="Fermer la bannière"
                >
                    <FiX className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
