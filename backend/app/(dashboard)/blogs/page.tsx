'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { api } from '@/lib/utils/api';
import { formatDate } from '@/lib/utils/format';
import { Blog } from '@/types';
import { useToast } from '@/components/ui/Toast';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      const response: any = await api.get('/api/blogs');
      setBlogs(response.data);
    } catch (error) {
      showToast('Erreur de chargement', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet article ?')) return;

    try {
      await api.delete(`/api/blogs/${id}`);
      showToast('Article supprimé', 'success');
      loadBlogs();
    } catch (error) {
      showToast('Erreur de suppression', 'error');
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await api.put(`/api/blogs/${id}`, {
        isPublished: !currentStatus,
        publishedAt: !currentStatus ? new Date().toISOString() : null,
      });
      showToast(
        !currentStatus ? 'Article publié' : 'Article mis en brouillon',
        'success'
      );
      loadBlogs();
    } catch (error) {
      showToast('Erreur de mise à jour', 'error');
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Articles de Blog</h1>
        <Link href="/blogs/new">
          <Button>+ Nouvel Article</Button>
        </Link>
      </div>

      <Card padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Publié le</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500">
                  Aucun article
                </TableCell>
              </TableRow>
            ) : (
              blogs.map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{blog.title}</p>
                      {blog.excerpt && (
                        <p className="text-sm text-gray-500 truncate max-w-md">
                          {blog.excerpt}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{blog.category}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        blog.isPublished
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {blog.isPublished ? 'Publié' : 'Brouillon'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {blog.publishedAt ? formatDate(blog.publishedAt) : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link href={`/blogs/${blog.id}/edit`}>
                        <Button size="sm" variant="ghost">
                          Modifier
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant={blog.isPublished ? 'secondary' : 'primary'}
                        onClick={() =>
                          handleTogglePublish(blog.id, blog.isPublished)
                        }
                      >
                        {blog.isPublished ? 'Dépublier' : 'Publier'}
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(blog.id)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}