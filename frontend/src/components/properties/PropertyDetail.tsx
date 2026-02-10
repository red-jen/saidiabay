'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FiMapPin, 
  FiMaximize, 
  FiCheck, 
  FiPhone, 
  FiMail,
  FiCalendar,
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
  FiWifi,
  FiShare2,
  FiHeart
} from 'react-icons/fi';
import { IoBedOutline } from 'react-icons/io5';
import { LuBath, LuWaves, LuSnowflake, LuTv, LuChefHat } from 'react-icons/lu';
import { MdOutlineLocalParking, MdOutlineBalcony, MdOutlineLocalLaundryService, MdOutlineGarage, MdOutlineGrass } from 'react-icons/md';
import { propertiesApi } from '@/lib/api';
import { Property } from '@/types';
import ReservationForm from './ReservationForm';
import BuyRequestForm from './BuyRequestForm';

interface PropertyDetailProps {
  slug: string;
}

const PropertyDetail = ({ slug }: PropertyDetailProps) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const data = await propertiesApi.getById(slug);
        if (data && typeof data === 'object') {
          setProperty(data);
        } else {
          setProperty(null);
        }
      } catch (error: any) {
        console.error('Error fetching property:', error);
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProperty();
    } else {
      setLoading(false);
    }
  }, [slug]);

  // Keyboard navigation for images
  useEffect(() => {
    if (!property?.images || property.images.length <= 1) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setSelectedImage((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setSelectedImage((prev) => (prev === property.images.length - 1 ? 0 : prev + 1));
      } else if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [property?.images]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="animate-fade-in">
        {/* Hero skeleton */}
        <div className="w-full h-[50vh] lg:h-[70vh] bg-gradient-to-br from-secondary-200 via-secondary-100 to-secondary-200 animate-pulse" />
        <div className="container mx-auto px-4 lg:px-8 xl:px-12 -mt-20 relative z-10">
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-elegant-lg animate-pulse">
            <div className="h-8 w-48 bg-secondary-200 rounded-lg mb-4" />
            <div className="h-12 w-3/4 bg-secondary-200 rounded-lg mb-6" />
            <div className="h-6 w-64 bg-secondary-200 rounded-lg mb-8" />
            <div className="grid grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-28 bg-secondary-100 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-32 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-accent-500 to-transparent" />
            <span className="text-accent-500 text-xs font-semibold tracking-[0.3em] uppercase font-sans">
              Erreur
            </span>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-accent-500 to-transparent" />
          </div>
          <h1 className="font-serif text-5xl lg:text-6xl font-light text-primary-900 mb-8 leading-tight tracking-tight">
            Propriété Non Trouvée
          </h1>
          <p className="text-secondary-500 mb-12 text-lg leading-relaxed font-light">
            La propriété que vous recherchez n&apos;existe pas ou a été supprimée.
          </p>
          <Link href="/properties" className="inline-flex items-center gap-3 px-10 py-4 bg-primary-900 text-white font-medium rounded-full hover:bg-primary-800 transition-all shadow-elegant-lg hover:shadow-elegant-xl hover:-translate-y-0.5 tracking-wide text-sm">
            Voir Toutes les Propriétés
          </Link>
        </div>
      </div>
    );
  }

  // Map backend fields
  const bedrooms = property.chambres || property.bedrooms;
  const bathrooms = property.sallesDeBain || property.bathrooms;
  const area = property.surface || property.area;
  const location = property.city?.name || property.location || property.address || 'Saidia Bay';
  const listingTypeStr = String(property.listingType || '').toUpperCase();
  const isRental = listingTypeStr === 'LOCATION';
  const statusStr = String(property.status || '').toUpperCase();
  const isAvailable = statusStr === 'AVAILABLE' || statusStr === 'DISPONIBLE' || !property.status;

  // Build amenities
  const amenities = [];
  if (property.wifi) amenities.push({ icon: FiWifi, label: 'WiFi Haut Débit' });
  if (property.piscine) amenities.push({ icon: LuWaves, label: 'Piscine Privée' });
  if (property.climatisation) amenities.push({ icon: LuSnowflake, label: 'Climatisation' });
  if (property.parking) amenities.push({ icon: MdOutlineLocalParking, label: 'Parking' });
  if (property.balcon) amenities.push({ icon: MdOutlineBalcony, label: 'Balcon / Terrasse' });
  if (property.tv) amenities.push({ icon: LuTv, label: 'Télévision' });
  if (property.cuisine) amenities.push({ icon: LuChefHat, label: 'Cuisine Équipée' });
  if (property.machineLaver) amenities.push({ icon: MdOutlineLocalLaundryService, label: 'Machine à Laver' });
  if (property.garage && property.garage > 0) amenities.push({ icon: MdOutlineGarage, label: `Garage (${property.garage})` });
  if (property.gazon) amenities.push({ icon: MdOutlineGrass, label: 'Jardin Privatif' });

  const formatPrice = (price: number, listingType: string) => {
    const formatted = price.toLocaleString('fr-FR');
    if (listingType === 'LOCATION') {
      return { amount: formatted, suffix: 'DH/mois' };
    }
    return { amount: formatted, suffix: 'DH' };
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      AVAILABLE: 'Disponible', DISPONIBLE: 'Disponible', available: 'Disponible',
      PENDING: 'En attente', EN_ATTENTE: 'En attente', pending: 'En attente',
      SOLD: 'Vendu', VENDU: 'Vendu', sold: 'Vendu',
      LOUE: 'Loué', rented: 'Loué',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const upper = status.toUpperCase();
    if (['AVAILABLE', 'DISPONIBLE'].includes(upper)) return 'bg-emerald-500';
    if (['PENDING', 'EN_ATTENTE'].includes(upper)) return 'bg-amber-500';
    if (['SOLD', 'VENDU'].includes(upper)) return 'bg-red-500';
    if (upper === 'LOUE') return 'bg-blue-500';
    return 'bg-gray-500';
  };

  const priceData = formatPrice(property.price, property.listingType);

  const keyFeatures = [
    bedrooms && { icon: IoBedOutline, value: bedrooms, label: 'Chambres', suffix: bedrooms > 1 ? 'chambres' : 'chambre' },
    bathrooms && { icon: LuBath, value: bathrooms, label: 'Salles de bain', suffix: bathrooms > 1 ? 'salles de bain' : 'salle de bain' },
    area && { icon: FiMaximize, value: area, label: 'Surface', suffix: 'm²' },
    property.anneeCons && { icon: FiCalendar, value: property.anneeCons, label: 'Année', suffix: '' },
  ].filter(Boolean) as { icon: any; value: number; label: string; suffix: string }[];

  return (
    <>
      {/* Fullscreen Image Modal */}
      {isFullscreen && property.images && property.images.length > 0 && (
        <div className="fixed inset-0 z-[9999] bg-primary-950/95 backdrop-blur-xl flex items-center justify-center" onClick={() => setIsFullscreen(false)}>
          <button 
            onClick={() => setIsFullscreen(false)} 
            className="absolute top-6 right-6 z-50 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            ✕
          </button>
          <div className="relative w-full h-full max-w-7xl max-h-[90vh] mx-4" onClick={(e) => e.stopPropagation()}>
            <Image
              src={property.images[selectedImage]}
              alt={property.title}
              fill
              className="object-contain"
            />
          </div>
          {property.images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedImage((prev) => (prev === 0 ? property.images.length - 1 : prev - 1)); }}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
              >
                <FiChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedImage((prev) => (prev === property.images.length - 1 ? 0 : prev + 1)); }}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
              >
                <FiChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
          {/* Bottom thumbnails in fullscreen */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {property.images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => { e.stopPropagation(); setSelectedImage(index); }}
                className={`w-2.5 h-2.5 rounded-full transition-all ${selectedImage === index ? 'bg-accent-500 scale-125' : 'bg-white/40 hover:bg-white/60'}`}
              />
            ))}
          </div>
        </div>
      )}

      <div className="animate-fade-in">
        {/* ===== HERO IMAGE GALLERY ===== */}
        <div className="relative">
          {/* Back Button - Floating */}
          <div className="absolute top-6 left-6 z-30">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/90 backdrop-blur-md rounded-full text-primary-900 hover:bg-white transition-all shadow-elegant-lg text-sm font-medium group border border-white/50"
            >
              <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Retour</span>
            </Link>
          </div>

          {/* Action Buttons - Floating */}
          <div className="absolute top-6 right-6 z-30 flex items-center gap-3">
            <button className="w-11 h-11 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-primary-900 hover:bg-white hover:text-accent-600 transition-all shadow-elegant-lg border border-white/50">
              <FiShare2 className="w-4 h-4" />
            </button>
            <button className="w-11 h-11 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-primary-900 hover:bg-white hover:text-red-500 transition-all shadow-elegant-lg border border-white/50">
              <FiHeart className="w-4 h-4" />
            </button>
          </div>

          {/* Main Image */}
          <div 
            className="relative h-[50vh] lg:h-[70vh] overflow-hidden cursor-pointer"
            onClick={() => property.images && property.images.length > 0 && setIsFullscreen(true)}
          >
            {property.images && property.images.length > 0 ? (
              <Image
                src={property.images[selectedImage]}
                alt={property.title}
                fill
                className="object-cover transition-transform duration-1000 hover:scale-[1.02]"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-secondary-200 via-secondary-100 to-secondary-50 flex items-center justify-center">
                <FiMapPin className="text-secondary-300" size={80} />
              </div>
            )}
            
            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary-950/70 via-primary-950/10 to-primary-950/20 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-950/20 via-transparent to-primary-950/20 pointer-events-none" />

            {/* Badges */}
            <div className="absolute bottom-8 left-8 z-20 flex flex-wrap items-center gap-3">
              <span className={`px-5 py-2 rounded-full text-xs font-bold tracking-[0.15em] uppercase shadow-lg backdrop-blur-sm ${
                isRental ? 'bg-primary-900/90 text-white border border-white/20' : 'bg-accent-500/90 text-white border border-accent-400/30'
              }`}>
                {isRental ? 'Location' : 'Vente'}
              </span>
              <span className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase bg-white/90 backdrop-blur-sm text-primary-900 shadow-lg border border-white/50">
                <span className={`w-2 h-2 rounded-full ${getStatusColor(property.status)} animate-pulse`} />
                {getStatusLabel(property.status)}
              </span>
              {property.propertyCategory && (
                <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold tracking-wider uppercase text-primary-900 shadow-lg border border-white/50">
                  {property.propertyCategory === 'VILLA' ? 'Villa' : 'Appartement'}
                </span>
              )}
            </div>

            {/* Image counter */}
            {property.images && property.images.length > 1 && (
              <div className="absolute bottom-8 right-8 z-20">
                <span className="px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-xs font-medium tracking-wide border border-white/10">
                  {selectedImage + 1} / {property.images.length}
                </span>
              </div>
            )}

            {/* Navigation Arrows */}
            {property.images && property.images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedImage((prev) => (prev === 0 ? property.images.length - 1 : prev - 1)); }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all border border-white/20"
                >
                  <FiChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedImage((prev) => (prev === property.images.length - 1 ? 0 : prev + 1)); }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all border border-white/20"
                >
                  <FiChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Strip */}
          {property.images && property.images.length > 1 && (
            <div className="bg-primary-950/95 backdrop-blur-xl border-t border-white/5">
              <div className="container mx-auto px-4 lg:px-8">
                <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative flex-shrink-0 h-16 w-24 lg:h-20 lg:w-28 rounded-lg overflow-hidden transition-all duration-300 ${
                        selectedImage === index 
                          ? 'ring-2 ring-accent-500 ring-offset-2 ring-offset-primary-950 opacity-100 scale-105' 
                          : 'opacity-50 hover:opacity-80 hover:scale-105'
                      }`}
                    >
                      <Image src={image} alt={`Vue ${index + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ===== MAIN CONTENT ===== */}
        <div className="bg-gradient-to-b from-white via-secondary-50/30 to-white">
          <div className="container mx-auto px-4 lg:px-8 xl:px-12">
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 py-10 lg:py-16">
              
              {/* Left Column - Property Info */}
              <div className="lg:col-span-2 space-y-0">
                
                {/* ===== TITLE & LOCATION CARD ===== */}
                <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-elegant-lg border border-secondary-100/80 -mt-16 relative z-10 mb-8">
                  {/* Decorative top accent */}
                  <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-accent-500/50 to-transparent" />
                  
                  {/* Label */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-px bg-accent-500" />
                    <span className="text-accent-600 text-[11px] font-bold tracking-[0.25em] uppercase font-sans">
                      {isRental ? 'Propriété en Location' : 'Propriété en Vente'}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-[3.5rem] font-light text-primary-900 mb-6 leading-[1.15] tracking-tight">
                    {property.title}
                  </h1>

                  {/* Location */}
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-accent-500/8 rounded-xl flex items-center justify-center">
                      <FiMapPin className="text-accent-600 w-[18px] h-[18px]" />
                    </div>
                    <span className="text-secondary-600 text-lg font-light tracking-wide">{location}</span>
                  </div>

                  {/* Elegant divider */}
                  <div className="h-px bg-gradient-to-r from-secondary-200 via-secondary-200 to-transparent mb-8" />

                  {/* Key Features Grid */}
                  {keyFeatures.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-5">
                      {keyFeatures.map((feature, index) => (
                        <div key={index} className="group text-center p-5 lg:p-6 bg-gradient-to-b from-secondary-50/80 to-white rounded-2xl border border-secondary-100 hover:border-accent-300/50 hover:shadow-elegant-md transition-all duration-300">
                          <div className="w-12 h-12 bg-accent-500/8 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-accent-500/15 transition-colors">
                            <feature.icon className="text-accent-600 w-5 h-5" />
                          </div>
                          <div className="font-serif text-2xl lg:text-3xl font-light text-primary-900 mb-1">
                            {feature.value}
                          </div>
                          <div className="text-[11px] text-secondary-500 font-semibold tracking-[0.1em] uppercase">{feature.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ===== DESCRIPTION ===== */}
                {property.description && (
                  <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-elegant border border-secondary-100/80 mb-8">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-8 h-px bg-accent-500" />
                      <h2 className="text-accent-600 text-[11px] font-bold tracking-[0.25em] uppercase font-sans">
                        Description
                      </h2>
                    </div>
                    
                    <div className="relative">
                      {/* Decorative quote mark */}
                      <div className="absolute -top-2 -left-2 text-6xl text-accent-200/60 font-serif leading-none select-none">"</div>
                      <p className="text-primary-800/75 leading-[1.9] whitespace-pre-line text-base lg:text-[17px] font-light pl-8 first-letter:text-4xl first-letter:font-serif first-letter:font-medium first-letter:text-primary-900 first-letter:float-left first-letter:mr-2 first-letter:leading-none">
                        {property.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* ===== AMENITIES ===== */}
                {amenities.length > 0 && (
                  <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-elegant border border-secondary-100/80 mb-8">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-px bg-accent-500" />
                      <h2 className="text-accent-600 text-[11px] font-bold tracking-[0.25em] uppercase font-sans">
                        Équipements & Prestations
                      </h2>
                    </div>
                    <p className="text-secondary-400 text-sm font-light mb-8 ml-11">
                      Cette propriété dispose des équipements suivants
                    </p>
                    
                    <div className="grid sm:grid-cols-2 gap-3">
                      {amenities.map((amenity, index) => (
                        <div 
                          key={index} 
                          className="group flex items-center gap-4 p-4 rounded-2xl border border-secondary-100 hover:border-accent-300/50 hover:bg-accent-50/30 transition-all duration-300"
                        >
                          <div className="w-11 h-11 bg-accent-500/8 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-accent-500/15 transition-colors">
                            <amenity.icon className="text-accent-600 w-5 h-5" />
                          </div>
                          <span className="text-primary-800/85 font-medium text-[15px]">{amenity.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Legacy features */}
                {property.features && property.features.length > 0 && (
                  <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-elegant border border-secondary-100/80 mb-8">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-8 h-px bg-accent-500" />
                      <h2 className="text-accent-600 text-[11px] font-bold tracking-[0.25em] uppercase font-sans">
                        Caractéristiques
                      </h2>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {property.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3 p-4 rounded-2xl border border-secondary-100 hover:border-accent-300/50 transition-all">
                          <div className="w-6 h-6 bg-accent-500/15 rounded-full flex items-center justify-center flex-shrink-0">
                            <FiCheck className="text-accent-600 w-3.5 h-3.5" />
                          </div>
                          <span className="text-primary-800/80 font-medium text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ===== RIGHT SIDEBAR ===== */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 lg:top-28 space-y-6">
                  
                  {/* ===== PRICE CARD ===== */}
                  <div className="bg-white rounded-3xl p-8 shadow-elegant-lg border border-secondary-100/80 relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-400 via-accent-500 to-accent-400" />
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent-500/5 rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary-900/5 rounded-full blur-3xl" />
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-px bg-accent-500" />
                        <span className="text-accent-600 text-[11px] font-bold tracking-[0.25em] uppercase font-sans">
                          Prix
                        </span>
                      </div>
                      
                      <div className="mb-2">
                        <span className="font-serif text-4xl lg:text-5xl font-light text-primary-900 tracking-tight">
                          {priceData.amount}
                        </span>
                        <span className="text-secondary-500 text-lg font-light ml-2">
                          {priceData.suffix}
                        </span>
                      </div>

                      {isRental && (
                        <p className="text-secondary-400 text-xs font-medium tracking-wide uppercase mb-6">Prix mensuel hors charges</p>
                      )}

                      {/* Divider */}
                      <div className="h-px bg-gradient-to-r from-secondary-200 via-secondary-200 to-transparent my-6" />
                    </div>

                    {/* Action based on listing type */}
                    <div className="relative z-10">
                      {isRental ? (
                        <>
                          {!isAvailable && (
                            <div className="mb-4 p-4 bg-amber-50 border border-amber-200/60 rounded-2xl">
                              <p className="text-xs text-amber-700 text-center font-medium">
                                ⚠️ Cette propriété peut ne pas être disponible pour le moment
                              </p>
                            </div>
                          )}
                          <ReservationForm propertyId={property.id || property._id || ''} propertyPrice={property.price} />
                        </>
                      ) : statusStr === 'SOLD' || statusStr === 'VENDU' ? (
                        <div className="text-center py-8 bg-secondary-50 rounded-2xl border border-secondary-200/60">
                          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-red-500 text-xl">✕</span>
                          </div>
                          <span className="text-primary-900 font-serif text-lg font-medium">Propriété Vendue</span>
                          <p className="text-xs text-secondary-400 mt-2 font-light">Cette propriété n&apos;est plus disponible</p>
                        </div>
                      ) : (
                        <BuyRequestForm 
                          propertyId={property.id || property._id || ''} 
                          propertyTitle={property.title}
                          propertyPrice={property.price}
                          propertyLocation={location}
                        />
                      )}
                    </div>
                  </div>

                  {/* ===== CONTACT CARD ===== */}
                  <div className="relative rounded-3xl overflow-hidden shadow-elegant-lg">
                    {/* Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-950 to-primary-900" />
                    <div className="absolute top-0 right-0 w-48 h-48 bg-accent-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-500/5 rounded-full blur-2xl" />
                    
                    {/* Subtle pattern */}
                    <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)', backgroundSize: '24px 24px' }} />

                    <div className="relative z-10 p-8">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-8 h-px bg-accent-400" />
                        <span className="text-accent-400 text-[11px] font-bold tracking-[0.25em] uppercase font-sans">
                          Contact
                        </span>
                      </div>
                      
                      <h3 className="font-serif text-2xl font-light text-white mb-3 tracking-tight">
                        Besoin d&apos;informations ?
                      </h3>
                      <p className="text-white/50 mb-8 text-sm font-light leading-relaxed">
                        Notre équipe d&apos;experts est à votre disposition pour vous accompagner dans votre projet.
                      </p>
                      
                      <div className="space-y-3">
                        <a
                          href="tel:+212600000000"
                          className="group flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-2xl hover:bg-white/10 border border-white/10 hover:border-accent-500/30 transition-all duration-300"
                        >
                          <div className="w-11 h-11 bg-accent-500/15 rounded-xl flex items-center justify-center group-hover:bg-accent-500/25 transition-colors">
                            <FiPhone className="text-accent-400 w-[18px] h-[18px]" />
                          </div>
                          <div>
                            <span className="text-white/90 font-medium text-sm block">+212 6 00 00 00 00</span>
                            <span className="text-white/30 text-[11px] font-medium tracking-wide">APPELER</span>
                          </div>
                        </a>
                        <a
                          href="mailto:contact@saidiabay.com"
                          className="group flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-2xl hover:bg-white/10 border border-white/10 hover:border-accent-500/30 transition-all duration-300"
                        >
                          <div className="w-11 h-11 bg-accent-500/15 rounded-xl flex items-center justify-center group-hover:bg-accent-500/25 transition-colors">
                            <FiMail className="text-accent-400 w-[18px] h-[18px]" />
                          </div>
                          <div>
                            <span className="text-white/90 font-medium text-sm block">contact@saidiabay.com</span>
                            <span className="text-white/30 text-[11px] font-medium tracking-wide">ENVOYER UN E-MAIL</span>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyDetail;
