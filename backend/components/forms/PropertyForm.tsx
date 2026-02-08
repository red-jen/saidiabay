'use client';
import React, { useState, useEffect } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Property, City } from '@/types';
import { api } from '@/lib/utils/api';
import MapPreviewWrapper from '../MapPreviewWrapper';
import 'leaflet/dist/leaflet.css';

interface PropertyFormProps {
  initialData?: Property;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
}) => {
  const [cities, setCities] = useState<City[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    propertyType: initialData?.propertyType || 'RENT',
    listingType: initialData?.listingType || 'LOCATION',
    propertyCategory: initialData?.propertyCategory || 'APPARTEMENT',
    status: initialData?.status || 'AVAILABLE',
    
    // Localisation
    cityId: initialData?.cityId || '',
    address: initialData?.address || '',
    latitude: initialData?.latitude || '',
    longitude: initialData?.longitude || '',
    
    // Médias
    images: initialData?.images || [],
    thumbnail: initialData?.thumbnail || '',
    videoUrl: initialData?.videoUrl || '',
    
    // Caractéristiques
    chambres: initialData?.chambres || '',
    sallesDeBain: initialData?.sallesDeBain || '',
    surface: initialData?.surface || '',
    anneeCons: initialData?.anneeCons || '',
    garage: initialData?.garage || '',
    
    // Équipements
    balcon: initialData?.balcon || false,
    climatisation: initialData?.climatisation || false,
    gazon: initialData?.gazon || false,
    machineLaver: initialData?.machineLaver || false,
    tv: initialData?.tv || false,
    parking: initialData?.parking || false,
    piscine: initialData?.piscine || false,
    wifi: initialData?.wifi || false,
    cuisine: initialData?.cuisine || false,
    
    isActive: initialData?.isActive ?? true,
  });

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    try {
      const response: any = await api.get('/api/cities');
      setCities(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des villes:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (formData.images.length + files.length > 30) {
      alert('Maximum 30 images autorisées');
      return;
    }

    setUploadingImages(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Vérifier la taille (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`${file.name} dépasse 10MB`);
        }

        return await uploadToCloudinary(file);
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setFormData({
        ...formData,
        images: [...formData.images, ...uploadedUrls],
      });
    } catch (error: any) {
      alert(error.message || 'Erreur lors de l\'upload');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('L\'image dépasse 10MB');
      return;
    }

    setUploadingImages(true);

    try {
      const url = await uploadToCloudinary(file);
      setFormData({ ...formData, thumbnail: url });
    } catch (error) {
      alert('Erreur lors de l\'upload de la miniature');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleSelectAllAmenities = () => {
    const allSelected = formData.balcon && formData.climatisation && formData.gazon &&
                        formData.machineLaver && formData.tv && formData.parking &&
                        formData.piscine && formData.wifi && formData.cuisine;

    setFormData({
      ...formData,
      balcon: !allSelected,
      climatisation: !allSelected,
      gazon: !allSelected,
      machineLaver: !allSelected,
      tv: !allSelected,
      parking: !allSelected,
      piscine: !allSelected,
      wifi: !allSelected,
      cuisine: !allSelected,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await onSubmit({
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price as string),
      propertyType: formData.propertyType,
      listingType: formData.listingType,
      propertyCategory: formData.propertyCategory,
      status: formData.status,
      
      cityId: formData.cityId,
      address: formData.address,
      latitude: formData.latitude ? parseFloat(formData.latitude as string) : undefined,
      longitude: formData.longitude ? parseFloat(formData.longitude as string) : undefined,
      
      images: formData.images,
      thumbnail: formData.thumbnail,
      videoUrl: formData.videoUrl || undefined,
      
      chambres: formData.chambres ? parseInt(formData.chambres as string) : undefined,
      sallesDeBain: formData.sallesDeBain ? parseInt(formData.sallesDeBain as string) : undefined,
      surface: formData.surface ? parseFloat(formData.surface as string) : undefined,
      anneeCons: formData.anneeCons ? parseInt(formData.anneeCons as string) : undefined,
      garage: formData.garage ? parseInt(formData.garage as string) : undefined,
      
      balcon: formData.balcon,
      climatisation: formData.climatisation,
      gazon: formData.gazon,
      machineLaver: formData.machineLaver,
      tv: formData.tv,
      parking: formData.parking,
      piscine: formData.piscine,
      wifi: formData.wifi,
      cuisine: formData.cuisine,
      
      isActive: formData.isActive,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informations de base */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Informations de base</h3>
        
        <Input
          label="Titre de la propriété"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="ex: Villa moderne avec piscine"
          required
        />

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Description détaillée de la propriété..."
          />
        </div>
      </div>

      {/* Type et catégorie */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Type et catégorie</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type d'annonce</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="listingType"
                  value="LOCATION"
                  checked={formData.listingType === 'LOCATION'}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span>Location</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="listingType"
                  value="VENTE"
                  checked={formData.listingType === 'VENTE'}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span>Vente</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <select
              name="propertyCategory"
              value={formData.propertyCategory}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="VILLA">Villa</option>
              <option value="APPARTEMENT">Appartement</option>
            </select>
          </div>
        </div>

        <Input
          label={formData.listingType === 'LOCATION' ? 'Prix par nuit (DH)' : 'Prix à partir de (DH)'}
          name="price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          placeholder={formData.listingType === 'LOCATION' ? '800' : '900000'}
          required
          className="mt-4"
        />

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="AVAILABLE">Disponible</option>
            <option value="PENDING">En attente</option>
            <option value="SOLD">Vendu</option>
          </select>
        </div>
      </div>

      {/* Localisation */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Localisation</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
            <select
              name="cityId"
              value={formData.cityId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner une ville</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Adresse complète"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="123 Rue Example, Quartier"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Latitude (optionnel)"
              name="latitude"
              type="number"
              step="any"
              value={formData.latitude}
              onChange={handleChange}
              placeholder="33.5731"
            />
            <Input
              label="Longitude (optionnel)"
              name="longitude"
              type="number"
              step="any"
              value={formData.longitude}
              onChange={handleChange}
              placeholder="-7.5898"
            />
          </div>

          {/* Map Preview */}
          {formData.latitude && formData.longitude && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aperçu de la carte
              </label>
              <MapPreviewWrapper
                latitude={Number(formData.latitude)}
                longitude={Number(formData.longitude)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Caractéristiques */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Caractéristiques</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Input
            label="Chambres"
            name="chambres"
            type="number"
            value={formData.chambres}
            onChange={handleChange}
            placeholder="3"
          />
          <Input
            label="Salles de bain"
            name="sallesDeBain"
            type="number"
            value={formData.sallesDeBain}
            onChange={handleChange}
            placeholder="2"
          />
          <Input
            label="Surface (m²)"
            name="surface"
            type="number"
            step="0.01"
            value={formData.surface}
            onChange={handleChange}
            placeholder="120"
          />
          <Input
            label="Année de construction"
            name="anneeCons"
            type="number"
            value={formData.anneeCons}
            onChange={handleChange}
            placeholder="2020"
          />
          <Input
            label="Places de garage"
            name="garage"
            type="number"
            value={formData.garage}
            onChange={handleChange}
            placeholder="1"
          />
        </div>
      </div>

      {/* Équipements */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Équipements</h3>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleSelectAllAmenities}
            className="text-sm"
          >
            {formData.balcon && formData.climatisation && formData.gazon &&
             formData.machineLaver && formData.tv && formData.parking &&
             formData.piscine && formData.wifi && formData.cuisine
              ? 'Tout désélectionner'
              : 'Sélectionner tous'}
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { name: 'balcon', label: '🏡 Balcon' },
            { name: 'climatisation', label: '❄️ Climatisation' },
            { name: 'gazon', label: '🌱 Gazon' },
            { name: 'machineLaver', label: '🧺 Machine à laver' },
            { name: 'tv', label: '📺 TV' },
            { name: 'parking', label: '🚗 Parking' },
            { name: 'piscine', label: '🏊 Piscine' },
            { name: 'wifi', label: '📶 Wi-Fi' },
            { name: 'cuisine', label: '🍳 Cuisine équipée' },
          ].map((equipment) => (
            <label key={equipment.name} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name={equipment.name}
                checked={formData[equipment.name as keyof typeof formData] as boolean}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm">{equipment.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Images */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Images (Cloudinary)</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images de la propriété (max 30, 10MB chacune)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImages || formData.images.length >= 30}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">
              Taille minimum recommandée: 1240 × 720 px • {formData.images.length}/30 images
            </p>
          </div>

          {formData.images.length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              {formData.images.map((url, index) => (
                <div key={index} className="relative group">
                  <img src={url} alt="" className="w-full h-24 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image miniature (requise)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailUpload}
              disabled={uploadingImages}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            {formData.thumbnail && (
              <img src={formData.thumbnail} alt="Thumbnail" className="mt-2 w-32 h-24 object-cover rounded" />
            )}
          </div>

          <Input
            label="Lien vidéo YouTube (optionnel)"
            name="videoUrl"
            type="url"
            value={formData.videoUrl}
            onChange={handleChange}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <label className="text-sm font-medium text-gray-700">Propriété active</label>
        </div>

        <Button type="submit" isLoading={isLoading || uploadingImages}>
          {initialData ? 'Mettre à jour' : 'Créer la propriété'}
        </Button>
      </div>
    </form>
  );
};