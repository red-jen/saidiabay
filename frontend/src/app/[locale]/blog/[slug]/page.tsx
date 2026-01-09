'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import BlogDetail from '@/components/blog/BlogDetail';
import RecentPosts from '@/components/blog/RecentPosts';
import NewsletterBox from '@/components/blog/NewsletterBox';
import { blogApi } from '@/lib/api';
import { BlogPost } from '@/types';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost();
      fetchRecentPosts();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const data = await blogApi.getPost(slug);
      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
      // Mock data for development
      const mockPost: BlogPost = {
        id: '1',
        title: '10 Tips for First-Time Home Buyers in Saidia Bay',
        slug: slug,
        excerpt: 'Buying your first home can be overwhelming. Here are essential tips to make the process smoother and ensure you make the right decision.',
        content: `
          <h2>Understanding the Saidia Bay Real Estate Market</h2>
          <p>Saidia Bay has emerged as one of the most desirable locations for property investment in recent years. With its stunning beaches, modern infrastructure, and growing community, it's no wonder first-time buyers are flocking to this coastal paradise.</p>
          
          <h2>1. Set a Realistic Budget</h2>
          <p>Before you start your property search, it's crucial to determine how much you can afford. Consider not just the purchase price, but also:</p>
          <ul>
            <li>Closing costs (typically 2-5% of the purchase price)</li>
            <li>Property taxes</li>
            <li>Homeowners insurance</li>
            <li>Maintenance and repairs</li>
            <li>HOA fees (if applicable)</li>
          </ul>

          <h2>2. Get Pre-Approved for a Mortgage</h2>
          <p>Getting pre-approved shows sellers you're serious and gives you a clear idea of your budget. Shop around with different lenders to find the best rates and terms.</p>

          <h2>3. Choose the Right Location</h2>
          <p>Location is everything in real estate. Consider factors like:</p>
          <ul>
            <li>Proximity to work and amenities</li>
            <li>School districts (if you have children)</li>
            <li>Future development plans</li>
            <li>Resale value</li>
          </ul>

          <h2>4. Work with a Local Real Estate Agent</h2>
          <p>A knowledgeable local agent can provide invaluable insights about neighborhoods, market trends, and negotiation strategies specific to Saidia Bay.</p>

          <h2>5. Inspect Before You Invest</h2>
          <p>Never skip the home inspection. It can save you thousands by uncovering potential issues before you commit to the purchase.</p>

          <h2>6. Understand Different Property Types</h2>
          <p>From beachfront villas to modern apartments, Saidia Bay offers various property types. Each has its pros and cons in terms of maintenance, costs, and lifestyle.</p>

          <h2>7. Consider Future Growth</h2>
          <p>Look for areas with planned infrastructure improvements, new developments, or growing business districts. These factors can significantly impact your property's future value.</p>

          <h2>8. Don't Rush the Decision</h2>
          <p>Take your time to view multiple properties and compare them. It's a big investment, and it's okay to be selective.</p>

          <h2>9. Factor in Additional Costs</h2>
          <p>Beyond the purchase price, budget for moving costs, furniture, minor repairs, and renovations to make the place truly yours.</p>

          <h2>10. Think Long-Term</h2>
          <p>Consider your future needs. Will the property accommodate a growing family? Is it in a neighborhood you'll want to stay in for years?</p>

          <h2>Conclusion</h2>
          <p>Buying your first home in Saidia Bay is an exciting milestone. By following these tips and working with experienced professionals, you can make a confident, informed decision that you'll be happy with for years to come.</p>

          <p><strong>Ready to start your property search?</strong> Browse our curated selection of properties in Saidia Bay or contact our team for personalized assistance.</p>
        `,
        featuredImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200',
        tags: ['buying', 'tips', 'first-time', 'saidia-bay'],
        authorId: '1',
        author: {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          role: 'admin',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        status: 'published',
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setPost(mockPost);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentPosts = async () => {
    try {
      const response = await blogApi.getPosts({ page: 1, limit: 5 });
      setRecentPosts(response.posts);
    } catch (error) {
      console.error('Error fetching recent posts:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 py-16">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="skeleton h-8 w-32 mb-8" />
            <div className="skeleton h-96 rounded-2xl mb-8" />
            <div className="skeleton h-12 w-3/4 mb-4" />
            <div className="skeleton h-6 w-1/2 mb-8" />
            <div className="space-y-4">
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-secondary-50 py-16">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-heading font-bold text-secondary-900 mb-4">
            Post Not Found
          </h1>
          <p className="text-secondary-600 mb-8">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <a href="/blog" className="btn-primary">
            Back to Blog
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="section py-16">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <BlogDetail post={post} />
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {recentPosts.length > 0 && <RecentPosts posts={recentPosts} />}
              <NewsletterBox />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

