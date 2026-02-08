'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Property } from '@/types';
import { formatCurrency } from '@/lib/utils/format';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

interface HeroSection {
  id: string;
  imageUrl: string;
  ctaLink: string;
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
  const [visitorId, setVisitorId] = useState<string>('');

  useEffect(() => {
    // Get or create visitor ID
    let vid = Cookies.get('visitor_id');
    if (!vid) {
      vid = uuidv4();
      Cookies.set('visitor_id', vid, { expires: 365 }); // 1 year
    }
    setVisitorId(vid);

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

      const sale = properties.find((p: Property) => p.listingType === 'VENTE');
      setSaleProperty(sale || null);

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

  const handleHeroClick = async (hero: HeroSection) => {
    if (!visitorId) return;

    // Get user ID if logged in
    const userStr = localStorage.getItem('user');
    const userId = userStr ? JSON.parse(userStr)?.id : null;

    // Track click
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/hero-clicks/track`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            heroId: hero.id,
            visitorId,
            userId,
          }),
        }
      );
    } catch (error) {
      console.error('Error tracking click:', error);
    }

    // Navigate to link
    if (hero.ctaLink.startsWith('/')) {
      router.push(hero.ctaLink);
    } else {
      window.location.href = hero.ctaLink;
    }
  };

  const handleReservation = (property: Property) => {
    const user = localStorage.getItem('user');
    
    if (!user) {
      router.push('/login');
      return;
    }

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
          {heroes.map((hero, index) => (
            <div
              key={hero.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentHero ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
            >
              <div
                onClick={() => handleHeroClick(hero)}
                className="absolute inset-0 bg-cover bg-center hover:scale-105 transition-transform duration-700 cursor-pointer"
                style={{ backgroundImage: `url(${hero.imageUrl})` }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-30 hover:bg-opacity-40 transition-all" />
              </div>
            </div>
          ))}

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

        <Link href={`/property/${property.id}`}>
          <img
            src={property.thumbnail}
            alt={property.title}
            className="w-full h-64 object-cover cursor-pointer hover:opacity-90 transition"
          />
        </Link>
      </div>

      <div className="p-6">
        <Link href={`/property/${property.id}`}>
          <h3 className="text-2xl font-bold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
            {property.title}
          </h3>
        </Link>

        <p className="text-gray-600 mb-4 flex items-center gap-2">
          📍 <span className="font-medium">{property.city?.name}</span>
        </p>

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

        <Link href={`/property/${property.id}`}>
          <Button className="w-full" size="lg">
            Voir les détails →
          </Button>
        </Link>
      </div>
    </div>
  );
}