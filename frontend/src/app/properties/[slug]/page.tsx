import { Metadata } from 'next';
import PropertyDetail from '@/components/properties/PropertyDetail';

export const metadata: Metadata = {
  title: 'Property Details - Saidia Bay Real Estate',
  description: 'View detailed information about this property including photos, amenities, and booking options.',
};

interface PropertyDetailPageProps {
  params: {
    slug: string;
  };
}

export default function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-secondary-50/50 to-white pt-20 md:pt-24 lg:pt-28">
      <PropertyDetail slug={params.slug} />
    </div>
  );
}

