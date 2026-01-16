'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiMapPin, FiPhone, FiMail, FiSend, FiInstagram, FiLinkedin, FiFacebook, FiArrowUpRight } from 'react-icons/fi';
import { toast } from 'react-toastify';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ContactContent() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        toast.success('Message envoyé avec succès !');
        setFormData({ name: '', email: '', phone: '', message: '' });
        setLoading(false);
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Header Animation
            const tl = gsap.timeline();
            tl.fromTo('.contact-title',
                { y: 100, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: 'power4.out', stagger: 0.1 }
            )
                .fromTo('.contact-card',
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out' },
                    '-=0.5'
                );

            // Form Animation
            gsap.fromTo('.form-element',
                { x: 50, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: '.contact-form-section',
                        start: 'top 70%'
                    }
                }
            );

        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="bg-neutral-50 min-h-screen relative overflow-hidden text-secondary-900">

            {/* Background Decorative */}
            <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-accent-100/30 blur-[120px] rounded-full pointer-events-none -z-10" />
            <div className="absolute bottom-0 left-0 w-[40vw] h-[40vh] bg-primary-100/30 blur-[100px] rounded-full pointer-events-none -z-10" />

            {/* --- HERO / INTRO --- */}
            <section className="pt-32 pb-20 px-6 lg:px-12 container mx-auto">
                <div className="max-w-4xl">
                    <span className="contact-title block text-accent-600 font-bold uppercase tracking-widest text-xs mb-4">
                        Contactez-nous
                    </span>
                    <h1 className="contact-title text-5xl md:text-7xl lg:text-8xl font-heading font-light leading-tight mb-8">
                        Parlons de votre <br />
                        <span className="font-serif italic text-primary-900">Prochain Chapitre</span>
                    </h1>
                    <p className="contact-title text-xl text-secondary-500 font-light max-w-2xl leading-relaxed">
                        Une question ? Un projet immobilier ? Notre équipe d'experts à Saidia Bay est à votre écoute pour concrétiser vos ambitions.
                    </p>
                </div>
            </section>

            {/* --- MAIN CONTENT GRID --- */}
            <div className="contact-form-section container mx-auto px-6 lg:px-12 pb-32">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">

                    {/* LEFT: INFO INFO */}
                    <div className="lg:col-span-5 space-y-12">

                        {/* Image Card showing office or vibe */}
                        <div className="contact-card relative h-64 w-full rounded-3xl overflow-hidden shadow-2xl mb-12 group">
                            <Image
                                src="/images/about/hero.jpg"
                                alt="Saidia Office View"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                            <div className="absolute bottom-6 left-6 text-white">
                                <p className="font-heading text-xl">Notre Bureau Principal</p>
                                <p className="text-sm opacity-80">Marina de Saidia</p>
                            </div>
                        </div>

                        {/* Info Details */}
                        <div className="space-y-8">
                            <div className="contact-card group">
                                <div className="flex items-center gap-4 mb-2 text-primary-900">
                                    <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center group-hover:bg-primary-900 group-hover:text-white transition-colors duration-300">
                                        <FiMapPin className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-sm font-bold uppercase tracking-wider">Adresse</h3>
                                </div>
                                <p className="pl-14 text-lg text-secondary-600 font-light">
                                    Marina Saidia Bay, <br />
                                    Saidia, 60600, Maroc
                                </p>
                            </div>

                            <div className="contact-card group">
                                <div className="flex items-center gap-4 mb-2 text-primary-900">
                                    <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center group-hover:bg-primary-900 group-hover:text-white transition-colors duration-300">
                                        <FiPhone className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-sm font-bold uppercase tracking-wider">Téléphone</h3>
                                </div>
                                <p className="pl-14 text-lg text-secondary-600 font-light cursor-pointer hover:text-accent-500 transition-colors">
                                    +212 6 00 00 00 00
                                </p>
                                <p className="pl-14 text-sm text-secondary-400 mt-1">Lun-Sam, 9h-19h</p>
                            </div>

                            <div className="contact-card group">
                                <div className="flex items-center gap-4 mb-2 text-primary-900">
                                    <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center group-hover:bg-primary-900 group-hover:text-white transition-colors duration-300">
                                        <FiMail className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-sm font-bold uppercase tracking-wider">Email</h3>
                                </div>
                                <p className="pl-14 text-lg text-secondary-600 font-light cursor-pointer hover:text-accent-500 transition-colors">
                                    contact@saidiabay.com
                                </p>
                            </div>
                        </div>

                        {/* Socials */}
                        <div className="contact-card pt-8 border-t border-gray-200">
                            <h3 className="text-sm font-bold uppercase tracking-wider mb-6 text-primary-900">Suivez-nous</h3>
                            <div className="flex gap-4">
                                {[FiInstagram, FiLinkedin, FiFacebook].map((Icon, i) => (
                                    <a key={i} href="#" className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-primary-900 hover:text-white hover:border-primary-900 transition-all duration-300">
                                        <Icon className="w-5 h-5" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: FORM */}
                    <div className="lg:col-span-7 bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-gray-100">
                        <h2 className="form-element text-3xl font-heading mb-8">Envoyez-nous un Message</h2>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="form-element group">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-secondary-400 mb-2 group-focus-within:text-primary-900 transition-colors">Nom Complet</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-transparent border-b border-gray-200 py-3 text-lg focus:outline-none focus:border-primary-900 transition-colors placeholder:text-gray-300"
                                        placeholder="ex. Jean Dupont"
                                        required
                                    />
                                </div>
                                <div className="form-element group">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-secondary-400 mb-2 group-focus-within:text-primary-900 transition-colors">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-transparent border-b border-gray-200 py-3 text-lg focus:outline-none focus:border-primary-900 transition-colors placeholder:text-gray-300"
                                        placeholder="ex. jean@exemple.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-element group">
                                <label className="block text-xs font-bold uppercase tracking-widest text-secondary-400 mb-2 group-focus-within:text-primary-900 transition-colors">Téléphone (Optionnel)</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-transparent border-b border-gray-200 py-3 text-lg focus:outline-none focus:border-primary-900 transition-colors placeholder:text-gray-300"
                                    placeholder="ex. +212 6..."
                                />
                            </div>

                            <div className="form-element group">
                                <label className="block text-xs font-bold uppercase tracking-widest text-secondary-400 mb-2 group-focus-within:text-primary-900 transition-colors">Votre Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full bg-transparent border-b border-gray-200 py-3 text-lg focus:outline-none focus:border-primary-900 transition-colors placeholder:text-gray-300 resize-none"
                                    placeholder="Dites-nous en plus sur votre projet..."
                                    required
                                />
                            </div>

                            <div className="form-element pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group relative inline-flex items-center gap-4 px-8 py-4 bg-primary-900 text-white rounded-full text-sm font-bold uppercase tracking-widest overflow-hidden hover:bg-primary-800 transition-all w-full md:w-auto justify-center"
                                >
                                    <span className="relative z-10">{loading ? 'Envoi...' : 'Envoyer le Message'}</span>
                                    {!loading && <FiArrowUpRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}
