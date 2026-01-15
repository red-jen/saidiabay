import { Metadata } from 'next';
import ContactContent from '@/components/contact/ContactContent';

export const metadata: Metadata = {
  title: 'Contactez-nous - Saidia Bay Immobilier',
  description: 'Une question ? Un projet ? Contactez notre équipe d\'experts pour vos besoins immobiliers à Saidia.',
};

export default function ContactPage() {
  return <ContactContent />;
}
