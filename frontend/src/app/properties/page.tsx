import { Metadata } from 'next';
import PropertyList from '@/components/properties/PropertyList';

export const metadata: Metadata = {
  title: 'Nos Propriétés - Saidia Bay Immobilier',
  description: 'Découvrez notre sélection exclusive d\'appartements, villas et biens immobiliers à vendre et à louer à Saidia Bay.',
};

export default function PropertiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-secondary-50 to-white">
      {/* Top padding with gradient overlay */}
      <div className="pt-24 md:pt-32 lg:pt-40 pb-8">
        <div className="container mx-auto px-4 lg:px-6">
          {/* Enhanced Page Header */}
          <div className="text-center mb-12 lg:mb-16">
            <div className="inline-block mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 font-semibold text-sm uppercase tracking-wider rounded-full">
                <span className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></span>
                Catalogue Premium
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-secondary-900 mb-6 bg-gradient-to-r from-secondary-900 via-secondary-800 to-secondary-900 bg-clip-text text-transparent">
              Nos Propriétés
            </h1>
            <p className="text-lg md:text-xl text-secondary-600 max-w-3xl mx-auto leading-relaxed">
              Explorez notre sélection soignée de biens immobiliers d'exception à Saidia Bay. 
              Chaque propriété a été soigneusement sélectionnée pour vous offrir le meilleur.
            </p>
          </div>

          <PropertyList />
        </div>
      </div>
    </div>
  );
}
