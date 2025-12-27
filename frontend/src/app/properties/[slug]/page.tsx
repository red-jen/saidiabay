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
    <div className="min-h-screen bg-secondary-50">
      <PropertyDetail slug={params.slug} />
    </div>
  );
}

