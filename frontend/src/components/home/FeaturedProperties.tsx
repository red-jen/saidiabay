'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight, FiMapPin, FiMaximize2, FiHeart } from 'react-icons/fi';
import { IoBedOutline } from 'react-icons/io5';
import { LuBath } from 'react-icons/lu';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { propertiesApi } from '@/lib/api';
import { Property } from '@/types';
import { useFavoritesStore } from '@/store/favoritesStore';

gsap.registerPlugin(ScrollTrigger);

const tabs = [
  { id: 'all', label: 'Toutes' },
  { id: 'LOCATION', label: 'Locations' },
  { id: 'VENTE', label: 'À Vendre' },
];

export default function FeaturedProperties() {
  const [activeTab, setActiveTab] = useState('all');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();

  useEffect(() => {
    setMounted(true);
    fetchProperties();
  }, [activeTab]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (gridRef.current && properties.length > 0) {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
        }
      );
    }
  }, [properties]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const params: Record<string, any> = { limit: 6, status: 'AVAILABLE' };

      if (activeTab === 'LOCATION' || activeTab === 'VENTE') {
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
    <section ref={sectionRef} className="section bg-ivory">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Header */}
        <div ref={titleRef} className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-px bg-accent-500" />
              <span className="text-accent-600 text-sm font-medium tracking-[0.2em] uppercase">
                Notre Sélection
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-primary-900 mb-4">
              Propriétés d'Exception
            </h2>
            <p className="text-secondary-600 max-w-lg">
              Découvrez notre collection soigneusement sélectionnée de biens immobiliers haut de gamme
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Tabs */}
            <div className="flex p-1 bg-white rounded-lg shadow-elegant">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 text-sm font-medium rounded-md transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary-900 text-white'
                      : 'text-primary-700 hover:text-primary-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <Link
              href="/properties"
              className="hidden md:inline-flex items-center gap-2 px-6 py-2.5 text-primary-900 font-medium hover:text-accent-600 transition-colors"
            >
              Voir tout
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden">
                <div className="aspect-[4/3] bg-secondary-200 animate-pulse" />
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-secondary-200 rounded animate-pulse w-1/2" />
                  <div className="h-6 bg-secondary-200 rounded animate-pulse" />
                  <div className="h-4 bg-secondary-200 rounded animate-pulse w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : properties.length > 0 ? (
          <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => {
              const propertyId = property.id || property._id || '';
              const location = property.city?.name || property.location || property.address || 'Saidia Bay';
              const bedrooms = property.chambres || property.bedrooms;
              const bathrooms = property.sallesDeBain || property.bathrooms;
              const area = property.surface || property.area;
              const isRental = property.listingType === 'LOCATION';

              return (
                <Link
                  key={propertyId}
                  href={`/properties/${property.slug || propertyId}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-elegant hover:shadow-elegant-lg transition-all duration-500"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={property.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600'}
                      alt={property.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                      <span className={`px-3 py-1.5 text-xs font-semibold tracking-wide uppercase rounded ${
                        isRental ? 'bg-primary-900 text-white' : 'bg-accent-500 text-white'
                      }`}>
                        {isRental ? 'Location' : 'Vente'}
                      </span>

                      <button
                        onClick={(e) => handleFavorite(e, propertyId)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                          mounted && isFavorite(propertyId)
                            ? 'bg-danger-500 text-white'
                            : 'bg-white/90 text-primary-700 hover:bg-white hover:text-danger-500'
                        }`}
                      >
                        <FiHeart className={`w-4 h-4 ${mounted && isFavorite(propertyId) ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Price Badge */}
                    <div className="absolute bottom-4 left-4">
                      <div className="px-4 py-2 bg-white/95 backdrop-blur-sm rounded-lg">
                        <span className="text-lg font-bold text-primary-900">
                          {property.price?.toLocaleString()} DH
                        </span>
                        {isRental && <span className="text-sm text-secondary-600">/mois</span>}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-secondary-500 text-sm mb-2">
                      <FiMapPin className="w-4 h-4 text-accent-500" />
                      <span>{location}</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-xl text-primary-900 mb-3 line-clamp-1 group-hover:text-accent-600 transition-colors">
                      {property.title}
                    </h3>

                    {/* Features */}
                    <div className="flex items-center gap-4 text-sm text-secondary-600 pt-4 border-t border-secondary-100">
                      {bedrooms && (
                        <div className="flex items-center gap-1.5">
                          <IoBedOutline className="w-4 h-4" />
                          <span>{bedrooms} ch.</span>
                        </div>
                      )}
                      {bathrooms && (
                        <div className="flex items-center gap-1.5">
                          <LuBath className="w-4 h-4" />
                          <span>{bathrooms} sdb.</span>
                        </div>
                      )}
                      {area && (
                        <div className="flex items-center gap-1.5">
                          <FiMaximize2 className="w-4 h-4" />
                          <span>{area} m²</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl">
            <p className="text-secondary-600 text-lg">Aucune propriété trouvée</p>
          </div>
        )}

        {/* View All Button - Mobile */}
        <div className="mt-10 text-center md:hidden">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary-900 text-white font-medium rounded-lg hover:bg-primary-800 transition-colors"
          >
            Voir toutes les propriétés
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
