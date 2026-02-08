'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { api } from '@/lib/utils/api';
import { useToast } from '@/components/ui/Toast';

export default function NewBlogPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    coverImage: '',
    videoUrl: '',
    category: '',
    metaTitle: '',
    metaDescription: '',
    isPublished: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });

    // Auto-générer le slug à partir du titre
    if (name === 'title') {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post('/api/blogs', {
        ...formData,
        publishedAt: formData.isPublished ? new Date().toISOString() : null,
      });
      showToast('Article créé', 'success');
      router.push('/blogs');
    } catch (error: any) {
      showToast(error.message || 'Erreur de création', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Nouvel Article</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <div className="space-y-4">
            <Input
              label="Titre"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <Input
              label="Slug (URL)"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Extrait
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Résumé de l'article..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenu
              </label>
              <TiptapEditor
                content={formData.content}
                onChange={(content) =>
                  setFormData({ ...formData, content })
                }
              />
            </div>

            <Input
              label="Image de couverture (URL Cloudinary)"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              type="url"
            />

            <Input
              label="Vidéo YouTube (URL)"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              type="url"
            />

            <Input
              label="Catégorie"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Immobilier, Conseils, Actualités..."
              required
            />
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">SEO</h3>
          <div className="space-y-4">
            <Input
              label="Titre SEO"
              name="metaTitle"
              value={formData.metaTitle}
              onChange={handleChange}
              placeholder="Si vide, utilise le titre de l'article"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description SEO
              </label>
              <textarea
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Description pour les moteurs de recherche..."
              />
            </div>
          </div>
        </Card>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span>Publier immédiatement</span>
          </label>

          <Button type="submit" isLoading={isLoading}>
            {formData.isPublished ? 'Créer et Publier' : 'Enregistrer en brouillon'}
          </Button>
        </div>
      </form>
    </div>
  );
}