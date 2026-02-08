'use client';
import React, { useState, useEffect } from 'react';

interface MapPreviewWrapperProps {
  latitude: number;
  longitude: number;
}

const MapPreviewWrapper: React.FC<MapPreviewWrapperProps> = ({ latitude, longitude }) => {
  const [MapComponent, setMapComponent] = useState<React.ComponentType<any> | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Dynamically import the map component only on client side after mount
    import('./MapPreview')
      .then((module) => {
        setMapComponent(() => module.default);
      })
      .catch((error) => {
        console.error('Failed to load map:', error);
      });
  }, [isMounted]);

  if (!isMounted || !MapComponent) {
    return (
      <div className="h-[300px] w-full bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-600">Chargement de la carte...</p>
      </div>
    );
  }

  return <MapComponent latitude={latitude} longitude={longitude} />;
};

export default MapPreviewWrapper;
