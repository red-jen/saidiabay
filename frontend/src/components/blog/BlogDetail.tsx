'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FiCalendar, FiUser, FiTag, FiArrowLeft, FiShare2 } from 'react-icons/fi';
import { BlogPost } from '@/types';

interface BlogDetailProps {
  post: BlogPost;
}

export default function BlogDetail({ post }: BlogDetailProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <article className="max-w-4xl mx-auto">
      {/* Back Button */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-secondary-600 hover:text-secondary-900 mb-8 transition-colors"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back to Blog
      </Link>

      {/* Featured Image */}
      <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
        <Image
          src={post.featuredImage || '/images/blog-placeholder.jpg'}
          alt={post.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Header */}
      <header className="mb-8">
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block px-4 py-1.5 text-sm font-medium text-accent-700 bg-accent-100 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-secondary-900 mb-6">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-6 text-secondary-600">
          <div className="flex items-center gap-2">
            <FiUser className="w-5 h-5" />
            <span className="font-medium">{post.author?.name || 'Admin'}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiCalendar className="w-5 h-5" />
            <span>{formatDate(post.createdAt)}</span>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center gap-2">
              <FiTag className="w-5 h-5" />
              <span>{post.tags.join(', ')}</span>
            </div>
          )}
          <button
            onClick={handleShare}
            className="ml-auto flex items-center gap-2 text-primary-700 hover:text-primary-900 transition-colors"
          >
            <FiShare2 className="w-5 h-5" />
            Share
          </button>
        </div>
      </header>

      {/* Divider */}
      <div className="divider" />

      {/* Content */}
      <div
        className="prose prose-lg max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: post.content }}
        style={{
          lineHeight: '1.8',
          color: '#222222',
        }}
      />

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-12 pt-8 border-t border-secondary-200">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 text-sm bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Author Box */}
      {post.author && (
        <div className="mt-12 p-8 bg-secondary-50 rounded-2xl">
          <div className="flex items-start gap-6">
            {post.author.avatar && (
              <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <h4 className="text-xl font-semibold text-secondary-900 mb-2">
                About {post.author.name}
              </h4>
              <p className="text-secondary-600">
                {post.author.bio || `${post.author.name} is a contributor to Saidia Bay Real Estate.`}
              </p>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

