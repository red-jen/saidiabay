'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { api } from '@/lib/utils/api';

export default function NewHeroPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  
  const [formData, setFormData] = useState({
    imageUrl: '',
    ctaLink: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Validate image dimensions
  const validateImageSize = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        const width = img.width;
        const height = img.height;
        
        if (width < 1280 || height < 720) {
          showToast(
            `Image trop petite (${width}x${height}px). Minimum requis: 1280x720px`,
            'error'
          );
          resolve(false);
        } else {
          resolve(true);
        }
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        showToast('Erreur de chargement de l\'image', 'error');
        resolve(false);
      };
      
      img.src = url;
    });
  };

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default');
    formData.append('folder', 'heroes');
    
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    
    if (!cloudName) {
      throw new Error('Configuration Cloudinary manquante');
    }

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Échec du téléchargement');
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Veuillez sélectionner une image', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast('Image trop grande (max 10MB)', 'error');
      return;
    }

    const isValidSize = await validateImageSize(file);
    if (!isValidSize) return;

    setIsUploading(true);
    showToast('Téléchargement de l\'image...', 'info');

    try {
      const url = await uploadImageToCloudinary(file);
      setFormData({ ...formData, imageUrl: url });
      setImagePreview(url);
      showToast('Image téléchargée avec succès', 'success');
    } catch (error) {
      console.error('Upload error:', error);
      showToast('Erreur lors du téléchargement', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.imageUrl) {
      showToast('L\'image est requise', 'error');
      return;
    }

    if (!formData.ctaLink) {
      showToast('Le lien est requis', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post('/api/heroes', formData);
      showToast('Image hero créée avec succès', 'success');
      router.push('/heroes');
    } catch (error: any) {
      showToast(error.message || 'Erreur de création', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Nouvelle Image Hero</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image Hero * <span className="text-red-600">(Requis)</span>
            </label>
            
            <div className="space-y-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="hero-image-upload"
                disabled={isUploading}
              />
              
              <label
                htmlFor="hero-image-upload"
                className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 ${
                  isUploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isUploading ? '⏳ Téléchargement...' : '📁 Sélectionner une image'}
              </label>

              <p className="text-sm text-gray-600">
                📏 <strong>Taille minimale:</strong> 1280 x 720 px<br />
                ✨ <strong>Taille recommandée:</strong> Un ratio de 16:9 ( 1920x1080 px ou 2560x1440 px)<br />
                📦 <strong>Taille maximale du fichier:</strong> 10 MB
              </p>

              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Aperçu:</p>
                  <img
                    src={imagePreview}
                    alt="Aperçu"
                    className="w-full h-48 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              )}
            </div>
          </div>

          {/* CTA Link (Required) */}
          <div>
            <Input
              label="Lien de destination * (Requis)"
              name="ctaLink"
              value={formData.ctaLink}
              onChange={handleChange}
              placeholder="Ex: /properties ou https://example.com"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Lien interne (ex: /properties) ou externe (ex: https://example.com). Les clics seront comptabilisés.
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={isUploading}
            >
              Créer l'image hero
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push('/heroes')}
            >
              Annuler
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}