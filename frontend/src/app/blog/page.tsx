'use client';

import { useState, useEffect } from 'react';
import { Metadata } from 'next';
import BlogCard from '@/components/blog/BlogCard';
import BlogHero from '@/components/blog/BlogHero';

import BlogCategories from '@/components/blog/BlogCategories';
import RecentPosts from '@/components/blog/RecentPosts';
import NewsletterBox from '@/components/blog/NewsletterBox';
import { blogApi } from '@/lib/api';
import { BlogPost } from '@/types';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, [page, activeCategory]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await blogApi.getPosts({
        page,
        limit: 9,
        category: activeCategory !== 'all' ? activeCategory : undefined,
      });
      setPosts(response.posts);
      setFilteredPosts(response.posts);
      setTotalPages(response.pagination.pages);
    } catch (error) {
      console.error('Error fetching posts:', error);
      // Use mock data for development
      const mockPosts: BlogPost[] = [
        {
          id: '1',
          title: '10 Conseils pour les Primo-Accédants à Saidia Bay',
          slug: '10-tips-first-time-home-buyers',
          excerpt: 'Acheter votre première maison peut être intimidant. Voici des conseils essentiels pour faciliter le processus.',
          content: '<p>Contenu complet ici...</p>',
          featuredImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
          tags: ['buying', 'tips', 'first-time'],
          views: 0,
          status: 'published' as const,
          authorId: '1',
          author: {
            id: '1',
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            role: 'admin' as const,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Tendances du Marché Immobilier 2024',
          slug: 'saidia-bay-market-trends-2024',
          excerpt: 'Une analyse approfondie du marché immobilier actuel à Saidia Bay, incluant les tendances de prix et les prévisions.',
          content: '<p>Contenu complet ici...</p>',
          featuredImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
          tags: ['market', 'trends', '2024'],
          views: 0,
          status: 'published' as const,
          authorId: '1',
          author: {
            id: '1',
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            role: 'admin' as const,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          title: 'Pourquoi Investir à Saidia Bay ?',
          slug: 'why-invest-saidia-bay',
          excerpt: 'Découvrez les principales raisons pour lesquelles Saidia Bay devient l\'une des destinations d\'investissement les plus attractives.',
          content: '<p>Contenu complet ici...</p>',
          featuredImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
          tags: ['investment', 'saidia', 'property'],
          views: 0,
          status: 'published' as const,
          authorId: '1',
          author: {
            id: '1',
            name: 'Michael Chen',
            email: 'michael@example.com',
            role: 'admin' as const,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setPosts(mockPosts);
      setFilteredPosts(mockPosts);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-secondary-50 pt-28 lg:pt-32">
      {/* Animated Hero Section */}
      <BlogHero />

      {/* Main Content */}
      <div className="section">
        <div className="container mx-auto">
          {/* Categories */}
          <BlogCategories
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Posts Grid */}
            <div className="lg:col-span-2">
              {loading ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="card p-6">
                      <div className="skeleton h-48 mb-4" />
                      <div className="skeleton h-6 w-3/4 mb-2" />
                      <div className="skeleton h-4 w-full mb-2" />
                      <div className="skeleton h-4 w-2/3" />
                    </div>
                  ))}
                </div>
              ) : filteredPosts.length > 0 ? (
                <>
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {filteredPosts.map((post) => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Précédent
                      </button>
                      <div className="flex items-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                          <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`w-10 h-10 rounded-lg font-medium transition-all ${p === page
                              ? 'bg-primary-900 text-white'
                              : 'bg-white text-secondary-700 hover:bg-secondary-50'
                              }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Suivant
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-secondary-600 text-lg">
                    Aucun article trouvé dans cette catégorie.
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <RecentPosts posts={posts} />
              <NewsletterBox />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
