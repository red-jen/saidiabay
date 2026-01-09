import { Metadata } from 'next';
import AboutContent from '@/components/about/AboutContent';

export const metadata: Metadata = {
  title: 'About Us - Saidia Bay Real Estate',
  description: 'Learn about our mission, values, and the team dedicated to helping you find your dream property in Saidia Bay.',
};

export default function AboutPage() {
  return <AboutContent />;
}
