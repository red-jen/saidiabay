import { Metadata } from 'next';
import PropertyList from '@/components/properties/PropertyList';
import PropertyFilters from '@/components/properties/PropertyFilters';

export const metadata: Metadata = {
  title: 'Properties',
  description: 'Browse our extensive collection of apartments, villas, and real estate properties for rent and sale in Saidia Bay.',
};

export default function PropertiesPage() {
  return (
    <div className="section">
      <div className="container mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="section-title">Our Properties</h1>
          <p className="section-subtitle">
            Explore our curated selection of premium properties in Saidia Bay
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            <PropertyFilters />
          </aside>

          {/* Property Grid */}
          <main className="flex-1">
            <PropertyList />
          </main>
        </div>
      </div>
    </div>
  );
}
