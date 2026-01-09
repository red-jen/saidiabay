'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { LuMapPin, LuPhone, LuMail, LuClock, LuArrowRight, LuMessageSquare } from 'react-icons/lu';
import ContactForm from '@/components/contact/ContactForm';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ContactContent() {
    const heroRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLDivElement>(null);
    const infoRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero Animation
            gsap.fromTo(
                '.hero-content > *',
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out' }
            );

            gsap.fromTo(
                '.hero-card',
                { x: 50, opacity: 0 },
                { x: 0, opacity: 1, duration: 1, delay: 0.5, ease: 'power3.out' }
            );

            // Form Animation
            gsap.fromTo(
                formRef.current,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: formRef.current,
                        start: 'top 80%',
                    },
                }
            );

            // Info Animation - Glass Cards
            gsap.fromTo(
                '.glass-card',
                { x: 50, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    scrollTrigger: {
                        trigger: infoRef.current,
                        start: 'top 80%',
                    },
                }
            );

            // CTA Animation
            gsap.fromTo(
                ctaRef.current,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: ctaRef.current,
                        start: 'top 85%',
                    },
                }
            );
        });

        return () => ctx.revert();
    }, []);

    const contactInfo = [
        {
            icon: LuMapPin,
            title: 'Visit Us',
            details: ['Saidia Bay Marina', 'Saidia, Morocco'],
        },
        {
            icon: LuPhone,
            title: 'Call Us',
            details: ['+212 6 00 00 00 00', '+212 5 00 00 00 00'],
        },
        {
            icon: LuMail,
            title: 'Email Us',
            details: ['contact@saidiabay.com', 'info@saidiabay.com'],
        },
        {
            icon: LuClock,
            title: 'Working Hours',
            details: ['Monday - Friday: 9:00 AM - 6:00 PM', 'Saturday: 10:00 AM - 4:00 PM'],
        },
    ];

    return (
        <div className="min-h-screen bg-secondary-50 overflow-hidden">
            {/* Hero Section - Floating Style */}
            <section ref={heroRef} className="relative pt-4 px-4 pb-20 lg:pb-32">
                <div className="relative h-[60vh] min-h-[500px] rounded-[2.5rem] overflow-hidden">
                    <Image
                        src="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1920"
                        alt="Contact Saidia Bay"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/30" />

                    <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-6">
                        <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white/20 border border-white/30 text-white text-sm font-medium tracking-wide uppercase backdrop-blur-md">
                            24/7 Support
                        </span>
                        <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6">
                            Get in Touch
                        </h1>
                        <p className="text-xl text-white/90 max-w-2xl font-light">
                            We're here to help you find your perfect piece of paradise.
                        </p>
                    </div>
                </div>

                {/* Floating Info Card */}
                <div className="container mx-auto px-4 relative z-20 -mt-20">
                    <div className="bg-white rounded-[2rem] shadow-2xl p-8 md:p-12 border border-secondary-100 max-w-5xl mx-auto">
                        <div className="grid md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-secondary-100">
                            {contactInfo.slice(0, 3).map((info, index) => (
                                <div key={index} className="flex flex-col items-center text-center p-4">
                                    <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-6 text-primary-900">
                                        <info.icon size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-secondary-900 mb-2">{info.title}</h3>
                                    {info.details.map((detail, idx) => (
                                        <p key={idx} className="text-secondary-600">{detail}</p>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="pb-20 lg:pb-32">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto" id="contact-form" ref={formRef}>
                        <div className="bg-white rounded-[2.5rem] shadow-xl border border-secondary-100 p-8 md:p-12 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50" />

                            <div className="text-center mb-10 relative z-10">
                                <span className="inline-flex items-center gap-2 rounded-full bg-accent-50 px-4 py-1.5 text-xs font-bold text-accent-700 uppercase tracking-wide border border-accent-100 mb-4">
                                    <LuClock className="w-3 h-3" />
                                    Response in &lt; 24h
                                </span>
                                <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary-900 mb-4">
                                    Tell us about your project
                                </h2>
                                <p className="text-secondary-600 max-w-lg mx-auto">
                                    Share a few details and one of our senior agents will follow up with a tailored selection of properties.
                                </p>
                            </div>

                            <ContactForm />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section ref={ctaRef} className="bg-primary-900 text-white py-20 md:py-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pattern-grid-lg" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
                        <div className="max-w-xl text-center lg:text-left">
                            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                                Ready to secure your <br />
                                <span className="text-accent-400">Saidia Bay property?</span>
                            </h2>
                            <p className="text-lg text-primary-100 leading-relaxed">
                                Browse our curated selection of properties or speak directly with an expert who knows every building on the marina.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto justify-center">
                            <a
                                href="/properties"
                                className="px-8 py-4 bg-white text-primary-900 rounded-full font-bold hover:bg-primary-50 transition-all hover:scale-105 shadow-xl"
                            >
                                Browse properties
                            </a>
                            <a
                                href="tel:+212600000000"
                                className="px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-full font-bold hover:bg-white/10 transition-all hover:scale-105 backdrop-blur-sm flex items-center justify-center gap-2"
                            >
                                <LuPhone />
                                Talk to an advisor
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
