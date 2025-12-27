'use client';

import { useState, useEffect } from 'react';
import { Metadata } from 'next';
import BlogCard from '@/components/blog/BlogCard';
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
          _id: '1',
          title: '10 Tips for First-Time Home Buyers in Saidia Bay',
          slug: '10-tips-first-time-home-buyers',
          excerpt: 'Buying your first home can be overwhelming. Here are essential tips to make the process smoother and ensure you make the right decision.',
          content: '<p>Full content here...</p>',
          featuredImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
          category: 'buying-guide',
          tags: ['buying', 'tips', 'first-time'],
          author: {
            _id: '1',
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            role: 'admin',
          },
          published: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: '2',
          title: 'Saidia Bay Real Estate Market Trends 2024',
          slug: 'saidia-bay-market-trends-2024',
          excerpt: 'An in-depth analysis of the current real estate market in Saidia Bay, including price trends, demand patterns, and future predictions.',
          content: '<p>Full content here...</p>',
          featuredImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
          category: 'market-insights',
          tags: ['market', 'trends', '2024'],
          author: {
            _id: '1',
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            role: 'admin',
          },
          published: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: '3',
          title: 'Why Invest in Saidia Bay Real Estate?',
          slug: 'why-invest-saidia-bay',
          excerpt: 'Discover the top reasons why Saidia Bay is becoming one of the most attractive investment destinations for real estate.',
          content: '<p>Full content here...</p>',
          featuredImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
          category: 'investment',
          tags: ['investment', 'saidia', 'property'],
          author: {
            _id: '1',
            name: 'Michael Chen',
            email: 'michael@example.com',
            role: 'admin',
          },
          published: true,
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
    <div className="min-h-screen bg-secondary-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-700 text-white py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
            Real Estate Blog
          </h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Stay updated with the latest news, tips, and insights about real estate in Saidia Bay
          </p>
        </div>
      </div>

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
                      <BlogCard key={post._id} post={post} />
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
                        Previous
                      </button>
                      <div className="flex items-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                          <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`w-10 h-10 rounded-lg font-medium transition-all ${
                              p === page
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
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-secondary-600 text-lg">
                    No blog posts found in this category.
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
