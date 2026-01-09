import { Metadata } from 'next';
import ContactContent from '@/components/contact/ContactContent';

export const metadata: Metadata = {
  title: 'Contact Us - Saidia Bay Real Estate',
  description: 'Get in touch with our team for any inquiries about properties, rentals, or sales in Saidia Bay.',
};

export default function ContactPage() {
  return <ContactContent />;
}
