'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { api } from '@/lib/utils/api';

export default function EditHeroPage() {
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [clickStats, setClickStats] = useState({ monthly: 0, total: 0 });
  
  const [formData, setFormData] = useState({
    imageUrl: '',
    ctaLink: '',
  });

  useEffect(() => {
    loadHero();
    loadClickStats();
  }, []);

  const loadHero = async () => {
    try {
      const response: any = await api.get(`/api/heroes/${params.id}`);
      setFormData({
        imageUrl: response.data.imageUrl,
        ctaLink: response.data.ctaLink,
      });
      setImagePreview(response.data.imageUrl);
    } catch (error) {
      showToast('Erreur de chargement', 'error');
      router.push('/heroes');
    } finally {
      setIsLoading(false);
    }
  };

  const loadClickStats = async () => {
    try {
      const [monthlyResponse, totalResponse]: any[] = await Promise.all([
        api.get(`/api/hero-clicks/${params.id}/monthly`),
        api.get(`/api/hero-clicks/${params.id}/total`),
      ]);

      setClickStats({
        monthly: monthlyResponse.data.clicks,
        total: totalResponse.data.totalClicks,
      });
    } catch (error) {
      console.error('Error loading click stats:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateImageSize = async (file: File): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      const img = new window.Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        const width = img.width;
        const height = img.height;

        if (width < 1080 || height < 600) {
          showToast(
            `Image trop petite (${width}x${height}px). Minimum requis: 1080x600px`,
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

    setIsSubmitting(true);

    try {
      // Only update the image URL, not the CTA link
      await api.put(`/api/heroes/${params.id}`, { imageUrl: formData.imageUrl });
      showToast('Image hero mise à jour', 'success');
      router.push('/heroes');
    } catch (error: any) {
      showToast(error.message || 'Erreur de mise à jour', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Modifier l'Image Hero</h1>
      </div>

      {/* Click Statistics */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">📊 Statistiques de clics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Clics ce mois-ci</p>
            <p className="text-3xl font-bold text-blue-600">{clickStats.monthly}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total des clics</p>
            <p className="text-3xl font-bold text-green-600">{clickStats.total}</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          💡 1 clic par utilisateur par jour est compté (évite les doubles-clics)
        </p>
      </Card>

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
                {isUploading ? '⏳ Téléchargement...' : '📁 Changer l\'image'}
              </label>

              <p className="text-sm text-gray-600">
                📏 <strong>Taille minimale:</strong> 1080 x 600 px<br />
                ✨ <strong>Taille recommandée:</strong> 1920 x 1080 px<br />
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

          {/* CTA Link (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lien de destination 🔒 <span className="text-gray-500">(Non modifiable)</span>
            </label>
            <div className="relative">
              <Input
                name="ctaLink"
                value={formData.ctaLink}
                onChange={handleChange}
                placeholder="Ex: /properties ou https://example.com"
                disabled
                className="bg-gray-50 cursor-not-allowed"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔒
              </span>
            </div>
            <p className="mt-1 text-sm text-amber-600">
              ⚠️ Le lien ne peut pas être modifié pour préserver l'historique des clics. Créez une nouvelle image hero pour utiliser un lien différent.
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={isUploading}
            >
              Mettre à jour
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