import { Metadata } from 'next';
import PropertyList from '@/components/properties/PropertyList';

export const metadata: Metadata = {
  title: 'Nos Propriétés - Saidia Bay Real Estate',
  description: 'Découvrez notre sélection exclusive d\'appartements, villas et biens immobiliers à vendre et à louer à Saidia Bay.',
};

export default function PropertiesPage() {
  return (
    <div className="min-h-screen bg-ivory">
      {/* Page Header with Premium Styling */}
      <div className="bg-primary-900 pt-28 md:pt-36 pb-16 md:pb-20">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-3xl">
            {/* Brand Label */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-px bg-accent-500" />
              <span className="text-accent-400 text-sm font-medium tracking-[0.2em] uppercase">
                Notre Collection
              </span>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white font-medium mb-6">
              Propriétés d'Exception
            </h1>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed">
              Explorez notre sélection soignée de biens immobiliers haut de gamme à Saidia Bay, 
              la perle de la Méditerranée marocaine.
            </p>
          </div>
        </div>
      </div>

      {/* Properties List Section */}
      <div className="container mx-auto px-4 lg:px-6 py-12 lg:py-16">
        <PropertyList />
      </div>
    </div>
  );
}
