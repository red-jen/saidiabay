'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
    {
        id: 1,
        name: 'Sarah Johnson',
        role: 'Home Buyer',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=90',
        rating: 5,
        text: 'Found our vacation home in Saidia Bay within two weeks. The team was incredibly professional and made everything seamless.',
    },
    {
        id: 2,
        name: 'Mohammed El Amrani',
        role: 'Property Investor',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=90',
        rating: 5,
        text: 'Best real estate experience I have ever had. Their market knowledge helped me make the perfect investment choice.',
    },
    {
        id: 3,
        name: 'Emma Laurent',
        role: 'Vacation Renter',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=90',
        rating: 5,
        text: 'We have been renting for 3 summers now. The properties are always immaculate and customer service is outstanding.',
    },
];

export default function TestimonialsSection() {
    const [activeIndex, setActiveIndex] = useState(0);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                sectionRef.current,
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse',
                    },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // Auto-play
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const current = testimonials[activeIndex];

    return (
        <section ref={sectionRef} className="py-16 lg:py-20 bg-white">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="max-w-2xl mx-auto text-center">
                    {/* Header */}
                    <h2 className="text-2xl lg:text-3xl font-semibold text-secondary-900 mb-8">
                        What our clients say
                    </h2>

                    {/* Testimonial Card */}
                    <div className="bg-secondary-50 rounded-2xl p-8 mb-6">
                        {/* Rating */}
                        <div className="flex items-center justify-center gap-1 mb-4">
                            {[...Array(current.rating)].map((_, i) => (
                                <FiStar key={i} className="w-5 h-5 text-amber-500 fill-amber-500" />
                            ))}
                        </div>

                        {/* Quote */}
                        <p className="text-secondary-700 text-lg leading-relaxed mb-6">
                            "{current.text}"
                        </p>

                        {/* Author */}
                        <div className="flex items-center justify-center gap-3">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden">
                                <Image src={current.avatar} alt={current.name} fill className="object-cover" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-secondary-900">{current.name}</p>
                                <p className="text-sm text-secondary-500">{current.role}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={() => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                            className="w-10 h-10 rounded-full border border-secondary-200 flex items-center justify-center text-secondary-600 hover:border-secondary-400 transition-colors"
                        >
                            <FiChevronLeft className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-2">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveIndex(index)}
                                    className={`h-2 rounded-full transition-all ${index === activeIndex ? 'w-6 bg-secondary-900' : 'w-2 bg-secondary-300'
                                        }`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={() => setActiveIndex((prev) => (prev + 1) % testimonials.length)}
                            className="w-10 h-10 rounded-full border border-secondary-200 flex items-center justify-center text-secondary-600 hover:border-secondary-400 transition-colors"
                        >
                            <FiChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
