'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LuCircleCheck, LuAward, LuUsers, LuHeart, LuArrowRight } from 'react-icons/lu';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AboutContent() {
    const heroRef = useRef<HTMLDivElement>(null);
    const storyRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);
    const valuesRef = useRef<HTMLDivElement>(null);
    const teamRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero Animation
            gsap.fromTo(
                '.hero-content > *',
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out' }
            );

            gsap.to('.hero-bg', {
                yPercent: 30,
                ease: 'none',
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                },
            });

            // Story Animation
            gsap.fromTo(
                '.story-text',
                { x: -50, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 1,
                    scrollTrigger: {
                        trigger: storyRef.current,
                        start: 'top 70%',
                    },
                }
            );

            gsap.fromTo(
                '.story-image',
                { x: 50, opacity: 0, scale: 0.9 },
                {
                    x: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 1,
                    scrollTrigger: {
                        trigger: storyRef.current,
                        start: 'top 70%',
                    },
                }
            );

            // Stats Animation
            gsap.fromTo(
                '.stat-item',
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: statsRef.current,
                        start: 'top 80%',
                    },
                }
            );

            // Values Animation - Bento Grid
            gsap.fromTo(
                '.bento-card',
                { y: 50, opacity: 0, scale: 0.95 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: valuesRef.current,
                        start: 'top 75%',
                    },
                }
            );

            // Team Animation
            gsap.fromTo(
                '.team-card',
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    scrollTrigger: {
                        trigger: teamRef.current,
                        start: 'top 75%',
                    },
                }
            );
        });

        return () => ctx.revert();
    }, []);

    const stats = [
        { value: '10+', label: 'Years Experience' },
        { value: '500+', label: 'Properties Sold' },
        { value: '1000+', label: 'Happy Clients' },
        { value: '100%', label: 'Verified Listings' },
    ];



    const team = [
        {
            name: 'Sarah Johnson',
            role: 'CEO & Founder',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
            bio: '15+ years of experience in luxury real estate',
        },
        {
            name: 'Michael Chen',
            role: 'Head of Sales',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
            bio: 'Expert in property investment and market analysis',
        },
        {
            name: 'Emma Williams',
            role: 'Property Manager',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
            bio: 'Specializes in vacation rentals and property management',
        },
        {
            name: 'David Martinez',
            role: 'Marketing Director',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
            bio: 'Digital marketing expert with a passion for real estate',
        },
    ];

    return (
        <div className="min-h-screen bg-white overflow-hidden">
            {/* Hero Section */}
            <div ref={heroRef} className="relative h-[80vh] min-h-[600px] flex items-center overflow-hidden">
                <div className="hero-bg absolute inset-0 w-full h-[120%] -top-[10%]">
                    <Image
                        src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920"
                        alt="About Saidia Bay Real Estate"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 via-primary-900/80 to-transparent" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="hero-content max-w-3xl text-white">
                        {/* <span className="inline-block px-4 py-1.5 mb-6 rounded-full bg-accent-500/20 border border-accent-500/30 text-accent-300 text-sm font-medium tracking-wide uppercase backdrop-blur-sm">
                            Est. 2014
                        </span> */}
                        <h1 className="text-6xl md:text-7xl lg:text-8xl font-heading font-bold mb-8 leading-tight text-white">
                            Crafting <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-300 to-accent-500">Lifestyles</span><br />
                            Not Just Homes
                        </h1>
                        <p className="text-xl md:text-2xl text-primary-100 max-w-2xl leading-relaxed font-light">
                            Your trusted partner in finding the perfect property in Morocco's Mediterranean paradise. We bring luxury and comfort together.
                        </p>
                    </div>
                </div>
            </div>

            {/* Story Section - Editorial Layout */}
            <div ref={storyRef} className="py-24 lg:py-32 overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="relative">
                        {/* Decorative Elements */}
                        <div className="absolute -top-20 -left-20 w-64 h-64 bg-accent-50 rounded-full blur-3xl opacity-50" />

                        <div className="grid lg:grid-cols-12 gap-12 items-center">
                            <div className="lg:col-span-5 lg:col-start-2 story-text relative z-10">
                                <h2 className="text-5xl md:text-6xl font-heading font-bold text-secondary-900 mb-10 leading-tight">
                                    A Decade of <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800">Excellence</span>
                                </h2>
                                <div className="space-y-8 text-lg text-secondary-600 leading-relaxed">
                                    <p className="first-letter:text-5xl first-letter:font-heading first-letter:font-bold first-letter:text-primary-900 first-letter:mr-3 float-left">
                                        Founded in 2014, Saidia Bay Real Estate has grown to become one of the most trusted
                                        names in Mediterranean property. Our journey began with a simple vision: to help
                                        people discover their dream homes in one of Morocco's most beautiful coastal regions.
                                    </p>
                                    <p>
                                        Over the years, we've built a reputation for exceptional service, deep local knowledge,
                                        and a genuine commitment to our clients' success. Whether you're looking for a vacation
                                        home, an investment property, or your permanent residence, we're here to guide you
                                        every step of the way.
                                    </p>
                                </div>
                            </div>

                            <div className="lg:col-span-6 story-image relative">
                                <div className="relative h-[700px] w-full rounded-[2rem] overflow-hidden shadow-2xl">
                                    <Image
                                        src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800"
                                        alt="Saidia Bay Properties"
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary-900/40 to-transparent" />

                                    {/* Floating Badge */}
                                    <div className="absolute bottom-10 left-10 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg max-w-xs">
                                        <p className="text-primary-900 font-heading font-bold text-xl mb-2">Saidia Bay</p>
                                        <p className="text-secondary-600 text-sm">The pearl of the Mediterranean, offering pristine beaches and luxury living.</p>
                                    </div>
                                </div>
                                {/* Offset Border */}
                                <div className="absolute -top-4 -right-4 w-full h-full border-2 border-primary-100 rounded-[2.5rem] -z-10" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div ref={statsRef} className="bg-primary-900 py-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pattern-grid-lg" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {stats.map((stat, index) => (
                            <div key={index} className="stat-item text-center">
                                <div className="text-6xl md:text-7xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-4">
                                    {stat.value}
                                </div>
                                <div className="text-lg text-primary-200 font-medium tracking-wide uppercase">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Values - Bento Grid */}
            <div ref={valuesRef} className="py-24 lg:py-32 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-20">
                        <span className="text-accent-500 font-bold tracking-wider uppercase text-xs mb-4 block">Our Philosophy</span>
                        <h2 className="text-4xl md:text-5xl font-heading font-bold text-secondary-900">
                            The Values That Drive Us
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {/* Card 1: Large - Integrity */}
                        <div className="bento-card md:col-span-2 bg-primary-900 text-white p-10 rounded-3xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-800 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 group-hover:opacity-70 transition-opacity" />
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm">
                                    <LuCircleCheck className="w-7 h-7 text-accent-300" />
                                </div>
                                <h3 className="text-3xl font-bold mb-4">Integrity First</h3>
                                <p className="text-primary-100 text-lg leading-relaxed max-w-md">
                                    We operate with complete transparency and honesty in all our dealings. Trust is the foundation of our business, and we earn it every day.
                                </p>
                            </div>
                        </div>

                        {/* Card 2: Tall - Excellence */}
                        <div className="bento-card md:row-span-2 bg-secondary-50 p-10 rounded-3xl border border-secondary-100 hover:border-primary-200 transition-colors group">
                            <div className="h-full flex flex-col">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                                    <LuAward className="w-7 h-7 text-primary-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-secondary-900 mb-4">Excellence</h3>
                                <p className="text-secondary-600 leading-relaxed mb-8 flex-grow">
                                    We strive for the highest standards in everything we do. From property curation to client service, "good enough" is never enough for us.
                                </p>
                                <div className="mt-auto pt-8 border-t border-secondary-200">
                                    <span className="text-primary-600 font-medium text-sm">Top Rated Agency 2024</span>
                                </div>
                            </div>
                        </div>

                        {/* Card 3: Standard - Client Focused */}
                        <div className="bento-card bg-white p-10 rounded-3xl border border-secondary-100 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="w-14 h-14 bg-accent-50 rounded-2xl flex items-center justify-center mb-8">
                                <LuUsers className="w-7 h-7 text-accent-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-secondary-900 mb-4">Client-Focused</h3>
                            <p className="text-secondary-600 leading-relaxed">
                                Your satisfaction and success are our top priorities. We listen, understand, and deliver.
                            </p>
                        </div>

                        {/* Card 4: Standard - Passion */}
                        <div className="bento-card bg-gradient-to-br from-primary-50 to-white p-10 rounded-3xl border border-primary-100">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                                <LuHeart className="w-7 h-7 text-red-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-secondary-900 mb-4">Passion</h3>
                            <p className="text-secondary-600 leading-relaxed">
                                We love what we do and it shows in our service quality. Real estate is our craft.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Team - Carousel Style */}
            <div ref={teamRef} className="py-24 lg:py-32 bg-secondary-50 overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div className="max-w-2xl">
                            <span className="text-primary-600 font-semibold tracking-wider uppercase text-sm">Our Experts</span>
                            <h2 className="text-4xl md:text-5xl font-heading font-bold text-secondary-900 mt-3">
                                Meet The Team
                            </h2>
                        </div>
                        <Link href="/contact" className="hidden md:inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors group">
                            Join our team
                            <LuArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {team.map((member, index) => (
                            <div
                                key={index}
                                className="team-card group relative h-[500px] rounded-[2rem] overflow-hidden cursor-pointer"
                            >
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                                <div className="absolute bottom-0 left-0 right-0 p-8">
                                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        <h3 className="text-2xl font-bold text-white mb-1">
                                            {member.name}
                                        </h3>
                                        <p className="text-accent-300 font-medium mb-4">
                                            {member.role}
                                        </p>
                                        <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-300">
                                            <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                                {member.bio}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="relative rounded-[3rem] overflow-hidden bg-primary-900 px-8 py-24 md:px-20 text-center">
                        {/* Abstract Shapes */}
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-800 rounded-full blur-3xl opacity-30 mix-blend-overlay" />
                            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-900 rounded-full blur-3xl opacity-30 mix-blend-overlay" />
                        </div>

                        <div className="relative z-10 max-w-4xl mx-auto">
                            <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-8 tracking-tight">
                                Ready to Find Your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-300 to-accent-500">Dream Property?</span>
                            </h2>
                            <p className="text-xl text-primary-100 mb-12 leading-relaxed max-w-2xl mx-auto">
                                Let our experienced team help you discover the perfect property in Saidia Bay.
                                Your Mediterranean paradise awaits.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <Link
                                    href="/properties"
                                    className="px-10 py-5 bg-white text-primary-900 rounded-full font-bold hover:bg-primary-50 transition-all hover:scale-105 shadow-xl flex items-center gap-2"
                                >
                                    Browse Properties
                                    <LuArrowRight />
                                </Link>
                                <Link
                                    href="/contact"
                                    className="px-10 py-5 bg-transparent border border-white/20 text-white rounded-full font-bold hover:bg-white/10 transition-all hover:scale-105 backdrop-blur-sm"
                                >
                                    Contact Us
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
