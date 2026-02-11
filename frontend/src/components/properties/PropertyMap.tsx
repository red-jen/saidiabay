'use client';

import { useEffect, useState } from 'react';
import { FiMapPin, FiExternalLink, FiNavigation, FiMaximize } from 'react-icons/fi';

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  title: string;
  address?: string;
}

const PropertyMap = ({ latitude, longitude, title, address }: PropertyMapProps) => {
  const [MapComponent, setMapComponent] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Dynamic import to avoid SSR issues with Leaflet
  useEffect(() => {
    const loadMap = async () => {
      const L = await import('leaflet');
      const { MapContainer, TileLayer, Marker, Popup } = await import('react-leaflet');

      // Fix default marker icon (Leaflet issue with bundlers)
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      // Custom luxury marker icon
      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div style="
            width: 40px; height: 40px;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            border: 3px solid white;
          ">
            <svg style="transform: rotate(45deg); width: 16px; height: 16px; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });

      // Create the map component
      const MapContent = ({ fullscreen }: { fullscreen?: boolean }) => (
        <MapContainer
          center={[latitude, longitude]}
          zoom={15}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%', borderRadius: fullscreen ? '0' : '1rem' }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[latitude, longitude]} icon={customIcon}>
            <Popup>
              <div style={{ fontFamily: 'system-ui, sans-serif', padding: '4px 0' }}>
                <strong style={{ fontSize: '14px', color: '#1a1a2e' }}>{title}</strong>
                {address && (
                  <p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0', lineHeight: '1.4' }}>
                    {address}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      );

      setMapComponent(() => MapContent);
    };

    loadMap();
  }, [latitude, longitude, title, address]);

  // Google Maps link
  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
  // Google Maps directions link
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  // Manage body scroll for fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isFullscreen]);

  // Close fullscreen on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <>
      <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-elegant border border-secondary-100/80 mb-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-px bg-accent-500" />
            <h2 className="text-accent-600 text-[11px] font-bold tracking-[0.25em] uppercase font-sans">
              Localisation
            </h2>
          </div>
          <button
            onClick={() => setIsFullscreen(true)}
            className="flex items-center gap-1.5 text-xs text-secondary-500 hover:text-primary-900 transition-colors"
          >
            <FiMaximize className="w-3.5 h-3.5" />
            Agrandir
          </button>
        </div>

        {address && (
          <div className="flex items-start gap-3 mb-6 ml-11">
            <FiMapPin className="text-accent-500 w-4 h-4 mt-0.5 flex-shrink-0" />
            <p className="text-secondary-500 text-sm font-light leading-relaxed">{address}</p>
          </div>
        )}

        {/* Map Container */}
        <div className="relative rounded-2xl overflow-hidden border border-secondary-200 isolate" style={{ height: '400px' }}>
          {MapComponent ? (
            <MapComponent />
          ) : (
            <div className="w-full h-full bg-secondary-100 flex items-center justify-center animate-pulse">
              <div className="text-center">
                <FiMapPin className="w-8 h-8 text-secondary-300 mx-auto mb-2" />
                <span className="text-sm text-secondary-400">Chargement de la carte...</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 mt-6">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-900 text-white rounded-full text-sm font-medium hover:bg-primary-800 transition-all group"
          >
            <FiExternalLink className="w-4 h-4" />
            Voir sur Google Maps
          </a>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-secondary-300 text-primary-900 rounded-full text-sm font-medium hover:bg-secondary-50 transition-all group"
          >
            <FiNavigation className="w-4 h-4" />
            Itinéraire
          </a>
          <span className="text-xs text-secondary-400 ml-auto hidden sm:block">
            {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </span>
        </div>
      </div>

      {/* Fullscreen Map Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-secondary-200 shadow-sm">
            <div>
              <h3 className="font-serif text-lg text-primary-900">{title}</h3>
              {address && <p className="text-xs text-secondary-500 mt-0.5">{address}</p>}
            </div>
            <div className="flex items-center gap-3">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-full text-xs font-medium hover:bg-primary-800 transition-all"
              >
                <FiExternalLink className="w-3.5 h-3.5" />
                Google Maps
              </a>
              <button
                onClick={() => setIsFullscreen(false)}
                className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center text-primary-900 hover:bg-secondary-200 transition-all"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Full Map */}
          <div className="flex-1">
            {MapComponent && <MapComponent fullscreen />}
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyMap;

