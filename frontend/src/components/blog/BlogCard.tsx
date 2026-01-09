'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FiCalendar, FiUser, FiArrowRight } from 'react-icons/fi';
import { BlogPost } from '@/types';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <article className="card shadow-md hover:shadow-luxury group">
      {/* Image */}
      <Link href={`/blog/${post.slug}`}>
        <div className="relative h-56 overflow-hidden">
          <Image
            src={post.featuredImage || '/images/blog-placeholder.jpg'}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>

      {/* Content */}
      <div className="p-6">
        {/* Category (Tag) */}
        {post.tags && post.tags.length > 0 && (
          <span className="inline-block px-3 py-1 mb-3 text-xs font-medium text-accent-700 bg-accent-100 rounded-full capitalize">
            {post.tags[0].replace(/-/g, ' ')}
          </span>
        )}

        {/* Title */}
        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-xl font-heading font-semibold text-secondary-900 mb-3 line-clamp-2 group-hover:text-primary-700 transition-colors">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-secondary-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-secondary-500 mb-4">
          <div className="flex items-center gap-1">
            <FiUser className="w-4 h-4" />
            <span>{post.author?.name || 'Admin'}</span>
          </div>
          <div className="flex items-center gap-1">
            <FiCalendar className="w-4 h-4" />
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>

        {/* Read More */}
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 text-primary-700 font-medium hover:text-primary-900 transition-colors group"
        >
          Read More
          <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}

