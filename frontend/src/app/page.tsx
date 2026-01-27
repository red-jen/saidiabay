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
  const [heroData, setHeroData] = useState<HeroData | null>(null);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const heroes = await heroesApi.getActive();
        if (heroes && heroes.length > 0) {
          // Get the first active hero for the main ad
          setHeroData(heroes[0]);
        }
      } catch (error) {
        console.error('Failed to fetch hero data:', error);
        // Hero section will use fallback image
      }
    };

    fetchHeroData();
  }, []);

  return (
    <>
      <HeroSection heroData={heroData || undefined} />
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

