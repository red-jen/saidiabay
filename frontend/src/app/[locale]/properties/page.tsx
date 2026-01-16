import { Metadata } from 'next';
import PropertyList from '@/components/properties/PropertyList';

export const metadata: Metadata = {
  title: 'Nos Propriétés - Saidia Bay Immobilier',
  description: 'Découvrez notre sélection exclusive d\'appartements, villas et biens immobiliers à vendre et à louer à Saidia Bay.',
};

export default function PropertiesPage() {
  return (
    <div className="section pt-32 lg:pt-40 bg-secondary-50 min-h-screen">
      <div className="container mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <span className="text-secondary-500 font-semibold text-sm uppercase tracking-wider mb-2 block">
            Catalogue
          </span>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-secondary-900 mb-4">
            Nos Propriétés
          </h1>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Explorez notre sélection soignée de biens immobiliers d'exception à Saidia Bay
          </p>
        </div>

        <PropertyList />
      </div>
    </div>
  );
}
