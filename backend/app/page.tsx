'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Property } from '@/types';
import { formatCurrency } from '@/lib/utils/format';

interface HeroSection {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  ctaText?: string;
  ctaLink?: string;
  order: number;
  isActive: boolean;
}

export default function HomePage() {
  const router = useRouter();
  const [saleProperty, setSaleProperty] = useState<Property | null>(null);
  const [rentProperty, setRentProperty] = useState<Property | null>(null);
  const [heroes, setHeroes] = useState<HeroSection[]>([]);
  const [currentHero, setCurrentHero] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProperties();
    loadHeroes();
  }, []);

  useEffect(() => {
    if (heroes.length > 1) {
      const interval = setInterval(() => {
        setCurrentHero((prev) => (prev + 1) % heroes.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [heroes.length]);

  const loadProperties = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/properties`
      );
      const data = await response.json();
      const properties = data.data.properties;

      // Get first property for VENTE
      const sale = properties.find((p: Property) => p.listingType === 'VENTE');
      setSaleProperty(sale || null);

      // Get first property for LOCATION
      const rent = properties.find((p: Property) => p.listingType === 'LOCATION');
      setRentProperty(rent || null);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadHeroes = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/heroes`
      );
      const data = await response.json();
      const activeHeroes = data.data.filter((h: HeroSection) => h.isActive);
      setHeroes(activeHeroes.sort((a: HeroSection, b: HeroSection) => a.order - b.order));
    } catch (error) {
      console.error('Erreur chargement heroes:', error);
    }
  };

  const handleReservation = (property: Property) => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    
    if (!user) {
      // Redirect to login if not logged in
      router.push('/login');
      return;
    }

    // Redirect to property detail page for reservation
    router.push(`/property/${property.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              🏠 Immobilier Premium
            </h1>
            <div className="flex gap-3">
              <Link href="/login">
                <Button variant="ghost">Connexion</Button>
              </Link>
              <Link href="/register">
                <Button>S'inscrire</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section / Slider */}
      {heroes.length > 0 ? (
        <section className="relative h-[500px] overflow-hidden">
          {heroes.map((hero, index) => {
            const heroContent = (
              <div
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentHero ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${hero.imageUrl})` }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-40" />
                </div>
                <div className="relative container mx-auto px-4 h-full flex items-center justify-center">
                  <div className="text-center text-white max-w-3xl">
                    {hero.title && (
                      <h2 className="text-5xl font-bold mb-4">{hero.title}</h2>
                    )}
                    {hero.subtitle && (
                      <p className="text-xl mb-8">{hero.subtitle}</p>
                    )}
                    {hero.ctaText && hero.ctaLink && (
                      <Link href={hero.ctaLink}>
                        <Button size="lg">{hero.ctaText}</Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );

            return hero.ctaLink ? (
              <Link key={hero.id} href={hero.ctaLink} className="block">
                {heroContent}
              </Link>
            ) : (
              <div key={hero.id}>
                {heroContent}
              </div>
            );
          })}

          {heroes.length > 1 && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
              {heroes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentHero(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentHero
                      ? 'bg-white w-8'
                      : 'bg-white bg-opacity-50'
                  }`}
                />
              ))}
            </div>
          )}
        </section>
      ) : (
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-5xl font-bold mb-4">
              Trouvez votre bien idéal
            </h2>
            <p className="text-xl mb-8">
              Location et vente de villas et appartements de prestige
            </p>
          </div>
        </section>
      )}

      {/* Properties Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Propriétés à la Une</h2>

        {isLoading ? (
          <div className="text-center py-12">Chargement...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* VENTE Property */}
            {saleProperty ? (
              <PropertyCard
                property={saleProperty}
                type="VENTE"
                onReservation={handleReservation}
              />
            ) : (
              <div className="bg-white rounded-lg p-12 text-center text-gray-500">
                <p>Aucun bien en vente disponible</p>
              </div>
            )}

            {/* LOCATION Property */}
            {rentProperty ? (
              <PropertyCard
                property={rentProperty}
                type="LOCATION"
                onReservation={handleReservation}
              />
            ) : (
              <div className="bg-white rounded-lg p-12 text-center text-gray-500">
                <p>Aucun bien en location disponible</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            <div>
              <h3 className="text-xl font-bold mb-4">Immobilier Premium</h3>
              <p className="text-gray-400">
                Votre partenaire de confiance pour la location et la vente de biens immobiliers de prestige.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Liens rapides</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-white">Accueil</Link></li>
                <li><Link href="/login" className="hover:text-white">Connexion</Link></li>
                <li><Link href="/register" className="hover:text-white">S'inscrire</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📞 0605911322</li>
                <li>
                  <a
                    href="https://wa.me/212605911322"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    💬 WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-gray-400">
            <p>© 2024 Immobilier Premium. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Property Card Component
function PropertyCard({
  property,
  type,
  onReservation,
}: {
  property: Property;
  type: 'VENTE' | 'LOCATION';
  onReservation: (property: Property) => void;
}) {
  const features = [];
  if (property.chambres) features.push(`🛏️ ${property.chambres} chambres`);
  if (property.sallesDeBain) features.push(`🚿 ${property.sallesDeBain} SdB`);
  if (property.surface) features.push(`📐 ${property.surface}m²`);
  if (property.parking) features.push('🚗 Parking');
  if (property.piscine) features.push('🏊 Piscine');

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg">
      {/* Badge */}
      <div className="relative">
        <span
          className={`absolute top-4 right-4 z-10 px-4 py-2 rounded-full text-sm font-bold ${
            type === 'LOCATION'
              ? 'bg-blue-600 text-white'
              : 'bg-green-600 text-white'
          }`}
        >
          {type === 'LOCATION' ? 'À Louer' : 'À Vendre'}
        </span>

        {/* Image */}
        <Link href={`/property/${property.id}`}>
          <img
            src={property.thumbnail}
            alt={property.title}
            className="w-full h-64 object-cover cursor-pointer hover:opacity-90 transition"
          />
        </Link>
      </div>

      {/* Content */}
      <div className="p-6">
        <Link href={`/property/${property.id}`}>
          <h3 className="text-2xl font-bold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
            {property.title}
          </h3>
        </Link>

        <p className="text-gray-600 mb-4 flex items-center gap-2">
          📍 <span className="font-medium">{property.city?.name}</span>
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-3 mb-6">
          {features.map((feature, idx) => (
            <span
              key={idx}
              className="text-sm bg-gray-100 px-3 py-2 rounded-lg font-medium"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Price */}
        <div className="mb-6 pb-6 border-b">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-blue-600">
              {formatCurrency(property.price)}
            </span>
            {type === 'LOCATION' && (
              <span className="text-gray-500">/nuit</span>
            )}
          </div>
        </div>

        {/* Reservation Button */}
        <Button
          onClick={() => onReservation(property)}
          className="w-full"
          size="lg"
        >
          {type === 'LOCATION' ? '📅 Réserver' : '💼 Je suis intéressé'}
        </Button>

        {/* View Details Link */}
        <Link href={`/property/${property.id}`}>
          <p className="text-center text-blue-600 hover:text-blue-700 mt-4 text-sm font-medium cursor-pointer">
            Voir les détails →
          </p>
        </Link>
      </div>
    </div>
  );
}