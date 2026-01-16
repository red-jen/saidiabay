import { Metadata } from 'next';
import AboutContent from '@/components/about/AboutContent';

export const metadata: Metadata = {
  title: 'À Propos de Nous - Saidia Bay Immobilier',
  description: 'Découvrez notre mission, nos valeurs et l\'équipe dévouée à vous aider à trouver la propriété de vos rêves à Saidia Bay.',
};

export default function AboutPage() {
  return <AboutContent />;
}

