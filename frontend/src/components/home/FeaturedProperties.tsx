'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight, FiMapPin, FiHeart, FiStar } from 'react-icons/fi';
import { IoBedOutline } from 'react-icons/io5';
import { LuBath } from 'react-icons/lu';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { propertiesApi } from '@/lib/api';
import { Property } from '@/types';
import { useFavoritesStore } from '@/store/favoritesStore';

gsap.registerPlugin(ScrollTrigger);

const tabs = [
  { id: 'all', label: 'Toutes les propriétés' },
  { id: 'featured', label: 'En Vedette' },
  { id: 'LOCATION', label: 'À Louer' },
  { id: 'VENTE', label: 'À Vendre' },
];

export default function FeaturedProperties() {
  const [activeTab, setActiveTab] = useState('France');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();

  useEffect(() => {
    setMounted(true);
    fetchProperties();
  }, [activeTab]);

  useEffect(() => {
    if (gridRef.current && properties.length > 0) {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' }
      );
    }
  }, [properties]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const params: Record<string, any> = { limit: 8 };

      if (activeTab === 'featured') {
        params.featured = true;
      } else if (activeTab === 'LOCATION' || activeTab === 'VENTE') {
        params.listingType = activeTab;
      }

      const data = await propertiesApi.getAll(params);
      setProperties(data.properties || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = (e: React.MouseEvent, propertyId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite(propertyId)) {
      removeFavorite(propertyId);
    } else {
      addFavorite(propertyId);
    }
  };

  return (
    <section ref={sectionRef} className="py-16 lg:py-20 bg-secondary-50/50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-accent-600 font-semibold text-sm uppercase tracking-wider mb-2">
              Propriétés
            </p>
            <h2 className="text-4xl lg:text-5xl font-heading font-bold text-secondary-900">
              Propriétés en Vedette
            </h2>
            <p className="text-secondary-600 mt-3 max-w-lg">
              Explorez notre sélection triée sur le volet de propriétés haut de gamme dans les meilleurs emplacements
            </p>
          </div>
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-secondary-700 font-medium hover:text-secondary-900 transition-colors"
          >
            Voir Tout
            <FiArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-all ${activeTab === tab
                  ? 'bg-secondary-900 text-white'
                  : 'bg-white text-secondary-600 hover:bg-secondary-100 border border-secondary-200'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden">
                <div className="skeleton h-48" />
                <div className="p-4">
                  <div className="skeleton h-4 w-3/4 mb-2" />
                  <div className="skeleton h-3 w-1/2 mb-3" />
                  <div className="skeleton h-5 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : properties.length > 0 ? (
          <div ref={gridRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {properties.map((property) => (
              <Link
                key={property.id}
                href={`/properties/${property.slug}`}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="relative aspect-[4/3]">
                  <Image
                    src={property.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400'}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />

                  {/* Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {property.isFeatured && (
                      <span className="px-3 py-1 bg-accent-500 text-white text-xs font-semibold rounded-full">
                        En Vedette
                      </span>
                    )}
                    <span className={`px-3 py-1 text-white text-xs font-semibold rounded-full ${property.listingType === 'VENTE' ? 'bg-primary-900' : 'bg-success-500'
                      }`}>
                      {property.listingType === 'VENTE' ? 'À Vendre' : 'À Louer'}
                    </span>
                  </div>

                  {/* Favorite */}
                  <button
                    onClick={(e) => handleFavorite(e, property._id)}
                    className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all ${mounted && isFavorite(property._id)
                        ? 'bg-danger-500 text-white'
                        : 'bg-white/90 text-secondary-600 hover:bg-white hover:text-danger-500'
                      }`}
                  >
                    <FiHeart className={`w-4 h-4 ${mounted && isFavorite(property.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-secondary-500 text-xs mb-1.5">
                    <FiMapPin className="w-3 h-3" />
                    <span className="truncate">{property.location}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-secondary-900 text-sm mb-2 line-clamp-1 group-hover:text-primary-700 transition-colors">
                    {property.title}
                  </h3>

                  {/* Features */}
                  <div className="flex items-center gap-4 text-secondary-600 text-sm mb-4">
                    {property.bedrooms && (
                      <div className="flex items-center gap-1">
                        <IoBedOutline className="w-4 h-4" />
                        <span>{property.bedrooms} Lits</span>
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="flex items-center gap-1">
                        <LuBath className="w-4 h-4" />
                        <span>{property.bathrooms} SDB</span>
                      </div>
                    )}
                    {property.area && (
                      <div className="flex items-center gap-1">
                        <FiMaximize2 className="w-4 h-4" />
                        <span>{property.area} m²</span>
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between pt-4 border-t border-secondary-100">
                    <div>
                      <span className="text-xl font-bold text-primary-900">
                        {property.price?.toLocaleString()} DH
                      </span>
                      {property.listingType === 'LOCATION' && (
                        <span className="text-secondary-500 text-sm"> /mois</span>
                      )}
                    </div>
                    <span className="text-primary-700 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      Voir Détails →
                    </span>
                  </div>
                  <p className="text-xs text-secondary-500">includes taxes & fees</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-secondary-600 text-lg">Aucune propriété trouvée</p>
          </div>
        )}
      </div>
    </section>
  );
}
