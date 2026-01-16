import HeroSection from '@/components/home/HeroSection';
import PromoBanner from '@/components/home/PromoBanner';
import DiscoverSection from '@/components/home/DiscoverSection';
import FeaturedProperties from '@/components/home/FeaturedProperties';
import AboutSection from '@/components/home/AboutSection';
import PromoSection from '@/components/home/PromoSection';
import TrustedSection from '@/components/home/TrustedSection';
import ServicesSection from '@/components/home/ServicesSection';
import CTASection from '@/components/home/CTASection';

export default function Home() {
  return (
    <>
      <PromoBanner />
      <HeroSection />
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
