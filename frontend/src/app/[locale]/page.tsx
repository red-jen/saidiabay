import HeroSection from '@/components/home/HeroSection';
import TrustedSection from '@/components/home/TrustedSection';
import DiscoverSection from '@/components/home/DiscoverSection';
import FeaturedProperties from '@/components/home/FeaturedProperties';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import AboutSection from '@/components/home/AboutSection';
import ServicesSection from '@/components/home/ServicesSection';
import CTASection from '@/components/home/CTASection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustedSection />
      <DiscoverSection />
      <FeaturedProperties />
      <TestimonialsSection />
      <AboutSection />
      <ServicesSection />
      <CTASection />
    </>
  );
}
