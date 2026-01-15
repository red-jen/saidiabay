'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiCheckCircle, FiAward, FiUsers, FiHeart, FiPlay, FiArrowRight, FiInstagram, FiLinkedin, FiTwitter } from 'react-icons/fi';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
    { value: '10+', label: "Années d'Expérience" },
    { value: '500+', label: 'Propriétés Vendues' },
    { value: '1K+', label: 'Clients Satisfaits' },
    { value: '100%', label: 'Vérifié' },
];

const values = [
    {
        title: 'Transparence Totale',
        description: 'Une clarté absolue dans chaque transaction. Pas de frais cachés, pas de surprises.',
        number: '01',
    },
    {
        title: 'Excellence Hôtelière',
        description: 'Nous traitons chaque client comme un invité de marque, avec un service 5 étoiles.',
        number: '02',
    },
    {
        title: 'Expertise Locale',
        description: 'Une connaissance intime du marché de Saidia et de ses opportunités cachées.',
        number: '03',
    },
    {
        title: 'Engagement Durable',
        description: 'Nous privilégions les projets respectueux de l\'environnement et de la communauté.',
        number: '04',
    },
];

const team = [
    {
        name: 'Sarah Johnson',
        role: 'Fondatrice & PDG',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80',
        bio: 'Visionnaire avec 15 ans d\'expérience dans le luxe.',
    },
    {
        name: 'Michael Chen',
        role: 'Directeur des Ventes',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80',
        bio: 'Expert en négociation et investissement stratégique.',
    },
    {
        name: 'Emma Williams',
        role: 'Gestion Client',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80',
        bio: 'Dédiée à créer des expériences inoubliables.',
    },
];

export default function AboutContent() {
    const containerRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const storyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {

            // 1. Hero Parallax & Reveal
            const tlHero = gsap.timeline();
            tlHero
                .fromTo('.hero-img',
                    { scale: 1.2, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 2, ease: 'power2.out' }
                )
                .fromTo('.hero-text-reveal',
                    { y: 100, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: 'power3.out' },
                    '-=1.5'
                );

            // Hero Scroll Effect
            gsap.to('.hero-img', {
                yPercent: 30,
                ease: 'none',
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });

            // 2. Story Section Semantic Reveal
            const storyLines = gsap.utils.toArray('.story-line');
            storyLines.forEach((line: any) => {
                gsap.fromTo(line,
                    { y: 50, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        scrollTrigger: {
                            trigger: line,
                            start: 'top 85%',
                            toggleActions: 'play none none reverse'
                        }
                    }
                );
            });

            // Image Parallax in Story
            gsap.to('.story-parallax-img', {
                yPercent: -20,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.story-wrapper',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                }
            });

            // 3. Values Horizontal Stagger
            gsap.fromTo('.value-item',
                { width: 0, opacity: 0 },
                {
                    width: '100%',
                    opacity: 1,
                    duration: 1,
                    stagger: 0.2,
                    ease: 'power3.inOut',
                    scrollTrigger: {
                        trigger: '.values-section',
                        start: 'top 70%',
                    }
                }
            );

            // 4. Team Reveal
            gsap.fromTo('.team-card',
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.15,
                    ease: 'power4.out',
                    scrollTrigger: {
                        trigger: '.team-section',
                        start: 'top 75%'
                    }
                }
            );

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="bg-neutral-50 text-secondary-900 font-sans selection:bg-accent-200 selection:text-primary-900 overflow-hidden">

            {/* --- HERO SECTION --- */}
            <section ref={heroRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/about/hero.jpg"
                        alt="Saidia Bay Luxury View"
                        fill
                        className="hero-img object-cover object-center"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/30 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
                </div>

                <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
                    <p className="hero-text-reveal text-sm md:text-base tracking-[0.3em] uppercase mb-6 font-medium text-accent-200">
                        Bienvenue à Saidia
                    </p>
                    <h1 className="hero-text-reveal text-5xl md:text-7xl lg:text-9xl font-heading font-light tracking-tight mb-8">
                        L'Art de Vivre <br />
                        <span className="font-serif italic font-normal text-white">Méditerranéen</span>
                    </h1>
                    <p className="hero-text-reveal text-lg md:text-xl font-light text-white/80 max-w-2xl mx-auto leading-relaxed border-l-2 border-accent-400 pl-6 text-left md:text-center md:border-l-0 md:pl-0">
                        Une approche réinventée de l'immobilier de prestige.
                        Plus qu'une agence, nous sommes les curateurs de votre futur style de vie.
                    </p>
                </div>
            </section>

            {/* --- STORY SECTION (Magazine Layout) --- */}
            <section ref={storyRef} className="story-wrapper relative py-32 bg-white">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="flex flex-col lg:flex-row gap-20 items-start">

                        {/* Left Column: Text */}
                        <div className="lg:w-1/2 pt-10 sticky top-10">
                            <span className="story-line block text-xs font-bold tracking-widest text-primary-900 uppercase mb-8 border-b border-gray-200 pb-4 inline-block">
                                01 — Notre Histoire
                            </span>
                            <h2 className="story-line text-4xl md:text-6xl font-heading font-normal text-secondary-900 mb-12 leading-tight">
                                De la Passion à <br />
                                <span className="font-serif italic text-primary-800">l'Excellence</span>
                            </h2>
                            <div className="story-line space-y-8 text-lg text-secondary-600 font-light leading-relaxed">
                                <p>
                                    <span className="text-4xl float-left mr-3 font-serif text-accent-500 leading-[0.8]">T</span>
                                    out a commencé par une simple promenade le long de la marina de Saidia. La lumière dorée, le bruit des vagues,
                                    l'architecture unique... Nous avons vu un potentiel inexploité, non pas seulement pour vendre des maisons,
                                    mais pour partager une vision.
                                </p>
                                <p>
                                    Depuis 2014, nous avons redéfini les standards de l'immobilier dans l'Oriental. Nous avons choisi de privilégier
                                    la qualité sur la quantité, l'humain sur la transaction.
                                </p>
                                <Link href="/contact" className="inline-flex items-center group text-primary-900 font-medium mt-4">
                                    <span className="border-b border-primary-900 pb-1 group-hover:border-accent-500 transition-colors">Discuter de votre projet</span>
                                    <FiArrowRight className="ml-3 transition-transform group-hover:translate-x-2" />
                                </Link>
                            </div>
                        </div>

                        {/* Right Column: Images (Parallax) */}
                        <div className="lg:w-1/2 relative h-[800px] w-full">
                            {/* Main Image */}
                            <div className="absolute top-0 right-0 w-[90%] h-[70%] bg-gray-200 overflow-hidden transform translate-x-8">
                                <Image
                                    src="/images/about/marina.jpg"
                                    alt="Saidia Marina Details"
                                    fill
                                    className="story-parallax-img object-cover scale-125"
                                />
                            </div>

                            {/* Secondary Overlapping Image */}
                            <div className="absolute bottom-0 left-0 w-[60%] h-[50%] bg-gray-100 shadow-2xl border-8 border-white overflow-hidden z-10">
                                <Image
                                    src="/images/about/night.webp"
                                    alt="Saidia Night Ambience"
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Decorative Number */}
                            <div className="absolute -bottom-10 -right-10 font-heading text-[12rem] text-gray-50 opacity-50 select-none z-0">
                                14
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- STATS STRIP --- */}
            <div className="bg-primary-900 text-white py-20 border-y border-white/10">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        {stats.map((s, i) => (
                            <div key={i} className="group cursor-default">
                                <div className="text-4xl md:text-6xl font-serif italic mb-2 group-hover:text-accent-400 transition-colors duration-500">
                                    {s.value}
                                </div>
                                <div className="text-xs uppercase tracking-widest text-white/60">
                                    {s.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- VALUES SECTION (Minimalist) --- */}
            <section className="values-section py-32 bg-neutral-100">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="mb-20">
                        <span className="text-xs font-bold tracking-widest text-primary-900 uppercase mb-4 block">
                            02 — Philosophie
                        </span>
                        <h2 className="text-4xl md:text-5xl font-heading font-normal">Nos Piliers Fondateurs</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
                        {values.map((v, i) => (
                            <div key={i} className="value-item border-t border-gray-300 pt-8 group hover:border-primary-900 transition-colors duration-500">
                                <span className="text-xs font-mono text-gray-400 mb-4 block group-hover:text-accent-600">
                                    {v.number}
                                </span>
                                <h3 className="text-2xl font-serif text-secondary-900 mb-4">
                                    {v.title}
                                </h3>
                                <p className="text-secondary-600 font-light leading-relaxed max-w-md">
                                    {v.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- TEAM SECTION --- */}
            <section className="team-section py-32 bg-white">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="text-center mb-24 max-w-3xl mx-auto">
                        <span className="text-xs font-bold tracking-widest text-primary-900 uppercase mb-4 block">
                            03 — L'Humain
                        </span>
                        <h2 className="text-4xl md:text-5xl font-heading mb-6">Les Visages de l'Excellence</h2>
                        <p className="text-secondary-500 font-light text-lg">
                            Une équipe d'experts passionnés, unis par un seul but : réaliser vos ambitions immobilières.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        {team.map((member, i) => (
                            <div key={i} className="team-card group cursor-pointer">
                                <div className="relative aspect-[3/4] overflow-hidden bg-gray-200 mb-6">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-white/90 backdrop-blur-sm">
                                        <p className="text-sm text-secondary-600 mb-4">{member.bio}</p>
                                        <div className="flex gap-4 text-primary-900">
                                            <FiLinkedin className="w-5 h-5 hover:text-accent-600" />
                                            <FiTwitter className="w-5 h-5 hover:text-accent-600" />
                                            <FiInstagram className="w-5 h-5 hover:text-accent-600" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-heading font-semibold text-secondary-900">{member.name}</h3>
                                    <p className="text-sm text-accent-600 uppercase tracking-wider mt-1">{member.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CTA / FOOTER PREVIEW --- */}
            <section className="relative py-32 bg-zinc-900 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <Image
                        src="/images/about/hero.jpg"
                        alt="Footer Ambience"
                        fill
                        className="object-cover grayscale"
                    />
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-5xl md:text-7xl font-heading font-light mb-12">
                        Écrivons la suite <br />
                        <span className="font-serif italic text-accent-300">Ensemble</span>
                    </h2>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
                        <Link href="/contact" className="px-10 py-4 bg-white text-black font-medium text-sm tracking-widest uppercase hover:bg-accent-200 transition-colors">
                            Contactez-nous
                        </Link>
                        <Link href="/properties" className="px-10 py-4 border border-white/30 text-white font-medium text-sm tracking-widest uppercase hover:bg-white/10 transition-colors">
                            Nos Propriétés
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}
