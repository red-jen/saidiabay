'use client';

import { useEffect, useState } from 'react';
import HeroSection from '@/components/home/HeroSection';
import DiscoverSection from '@/components/home/DiscoverSection';
import FeaturedProperties from '@/components/home/FeaturedProperties';
import AboutSection from '@/components/home/AboutSection';
import PromoSection from '@/components/home/PromoSection';
import TrustedSection from '@/components/home/TrustedSection';
import ServicesSection from '@/components/home/ServicesSection';
import CTASection from '@/components/home/CTASection';
import { heroesApi } from '@/lib/api';

interface HeroData {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  ctaText?: string;
  ctaLink?: string;
  order: number;
  isActive: boolean;
}

export default function Home() {
  const [heroes, setHeroes] = useState<HeroData[]>([]);

  useEffect(() => {
    const fetchHeroData = async () => {
      // Default fallback hero - always included first
      // Uses local image from public folder, can be changed via env variable
      const defaultHeroImage = process.env.NEXT_PUBLIC_DEFAULT_HERO_IMAGE || '/images/hero-1.png';
      
      const defaultHero: HeroData = {
        id: 'default',
        title: "L'Excellence Immobilière\nà Saidia Bay",
        subtitle: "Découvrez notre collection exclusive de propriétés d'exception sur la côte méditerranéenne du Maroc",
        imageUrl: defaultHeroImage,
        ctaText: "Explorer les Propriétés",
        ctaLink: "/properties",
        order: 0,
        isActive: true,
      };

      try {
        const activeHeroes = await heroesApi.getActive();
        if (activeHeroes && activeHeroes.length > 0) {
          // Always put default hero first, then backend heroes
          setHeroes([defaultHero, ...activeHeroes]);
        } else {
          // If no backend heroes, just use default
          setHeroes([defaultHero]);
        }
      } catch (error) {
        console.error('Failed to fetch hero data:', error);
        // On error, use default hero
        setHeroes([defaultHero]);
      }
    };

    fetchHeroData();
  }, []);

  return (
    <>
      <HeroSection heroes={heroes} />
      <DiscoverSection />
      <FeaturedProperties />
      <AboutSection />
      <PromoSection />
      <TrustedSection />
      <ServicesSection />
      <CTASection />
    </>
  );
}

