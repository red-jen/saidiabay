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

// Static blogs that will always be displayed
const STATIC_BLOGS: BlogPost[] = [
  {
    id: 'static-1',
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
    id: 'static-2',
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
    id: 'static-3',
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
      const limit = 9;
      const staticCount = STATIC_BLOGS.length;
      
      // Fetch uploaded blogs from API
      let uploadedPostsForPage: BlogPost[] = [];
      let allUploadedPosts: BlogPost[] = [];
      let uploadedPagination = { total: 0, pages: 1 };
      
      try {
        console.log('📝 Fetching blogs from API...');
        
        // Fetch all uploaded posts for sidebar (without pagination)
        const allResponse = await blogApi.getPosts({
          limit: 100, // Fetch a large number for sidebar
          category: activeCategory !== 'all' ? activeCategory : undefined,
        });
        
        console.log('📝 API Response:', allResponse);
        
        allUploadedPosts = allResponse?.posts || [];
        uploadedPagination = allResponse?.pagination || { total: 0, pages: 1 };
        
        console.log(`📝 Loaded ${allUploadedPosts.length} blogs from API`);
        
        // Fetch paginated posts for main content
        if (page === 1) {
          // Page 1: Fetch fewer uploaded blogs to make room for static blogs
          const remainingSlots = limit - staticCount;
          if (remainingSlots > 0) {
            uploadedPostsForPage = allUploadedPosts.slice(0, remainingSlots);
          }
        } else {
          // Other pages: Get the appropriate slice of uploaded posts
          const offset = (page - 1) * limit - staticCount;
          uploadedPostsForPage = allUploadedPosts.slice(offset, offset + limit);
        }
      } catch (apiError) {
        console.error('❌ Error fetching uploaded posts:', apiError);
        // Continue with static blogs even if API fails
      }
      
      // Combine static blogs with uploaded blogs for main display
      // Static blogs always come first on page 1
      let displayedPosts: BlogPost[] = [];
      
      if (page === 1) {
        // Page 1: Show all static blogs + first batch of uploaded blogs
        displayedPosts = [...STATIC_BLOGS, ...uploadedPostsForPage];
      } else {
        // Other pages: Only show uploaded blogs
        displayedPosts = uploadedPostsForPage;
      }
      
      // Store all posts (static + all uploaded) for sidebar (RecentPosts component)
      const allPosts = [...STATIC_BLOGS, ...allUploadedPosts];
      setPosts(allPosts);
      setFilteredPosts(displayedPosts);
      
      // Calculate total pages: page 1 has static + uploaded, other pages only uploaded
      const totalWithStatic = staticCount + uploadedPagination.total;
      setTotalPages(Math.ceil(totalWithStatic / limit));
    } catch (error) {
      console.error('Error fetching posts:', error);
      // If everything fails, still show static blogs
      setPosts(STATIC_BLOGS);
      setFilteredPosts(STATIC_BLOGS);
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
