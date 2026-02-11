'use client';

import { useEffect, useState } from 'react';
import { Property } from '@/types';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

interface PropertiesMapProps {
  properties: Property[];
}

// Dynamic import to avoid SSR issues
const PropertiesMapContent = ({ properties }: PropertiesMapProps) => {
  const [MapComponents, setMapComponents] = useState<any>(null);

  useEffect(() => {
    const loadMap = async () => {
      const L = await import('leaflet');
      const { MapContainer, TileLayer, Marker, Popup } = await import('react-leaflet');

      // Fix default marker icon
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      // Custom marker icon
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
            cursor: pointer;
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

      // Calculate center from properties
      const validProperties = properties.filter(p => p.latitude && p.longitude);
      
      let center: [number, number] = [33.9279, -2.3200]; // Default: Saidia Bay
      if (validProperties.length > 0) {
        const avgLat = validProperties.reduce((sum, p) => sum + (p.latitude || 0), 0) / validProperties.length;
        const avgLng = validProperties.reduce((sum, p) => sum + (p.longitude || 0), 0) / validProperties.length;
        center = [avgLat, avgLng];
      }

      const MapContent = () => (
        <MapContainer
          center={center}
          zoom={validProperties.length === 1 ? 15 : 12}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%', borderRadius: '1rem' }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {validProperties.map((property) => (
            <Marker
              key={property.id}
              position={[property.latitude!, property.longitude!]}
              icon={customIcon}
            >
              <Popup>
                <div style={{ fontFamily: 'system-ui, sans-serif', minWidth: '200px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a2e', marginBottom: '8px' }}>
                    {property.title}
                  </h3>
                  {property.address && (
                    <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                      {property.address}
                    </p>
                  )}
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a2e', marginBottom: '12px' }}>
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(property.price)}
                  </p>
                  <a
                    href={`/properties/${property.slug || property.id}`}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '8px 16px',
                      backgroundColor: '#1a1a2e',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      textAlign: 'center',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#16213e')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1a1a2e')}
                  >
                    Voir les détails
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      );

      setMapComponents(() => MapContent);
    };

    loadMap();
  }, [properties]);

  if (!MapComponents) {
    return (
      <div className="w-full h-[600px] bg-secondary-100 rounded-2xl flex items-center justify-center animate-pulse">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <span className="text-sm text-secondary-500">Chargement de la carte...</span>
        </div>
      </div>
    );
  }

  const validProperties = properties.filter(p => p.latitude && p.longitude);
  
  if (validProperties.length === 0) {
    return (
      <div className="w-full h-[600px] bg-secondary-50 rounded-2xl flex items-center justify-center border border-secondary-200">
        <div className="text-center">
          <svg className="w-16 h-16 text-secondary-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <p className="text-secondary-600 font-medium">Aucune propriété avec localisation disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] rounded-2xl overflow-hidden border border-secondary-200 shadow-elegant-lg isolate">
      <MapComponents />
    </div>
  );
};

// Export as dynamic component
const PropertiesMap = dynamic(() => Promise.resolve(PropertiesMapContent), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-secondary-100 rounded-2xl flex items-center justify-center animate-pulse">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <span className="text-sm text-secondary-500">Chargement de la carte...</span>
      </div>
    </div>
  ),
});

export default PropertiesMap;

