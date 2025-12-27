'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FiCalendar } from 'react-icons/fi';
import { BlogPost } from '@/types';

interface RecentPostsProps {
  posts: BlogPost[];
}

export default function RecentPosts({ posts }: RecentPostsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-heading font-semibold text-secondary-900 mb-6">
        Recent Posts
      </h3>
      <div className="space-y-4">
        {posts.slice(0, 5).map((post) => (
          <Link
            key={post._id}
            href={`/blog/${post.slug}`}
            className="flex gap-4 group"
          >
            {/* Thumbnail */}
            <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
              <Image
                src={post.featuredImage || '/images/blog-placeholder.jpg'}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-secondary-900 line-clamp-2 mb-1 group-hover:text-primary-700 transition-colors">
                {post.title}
              </h4>
              <div className="flex items-center gap-1 text-xs text-secondary-500">
                <FiCalendar className="w-3 h-3" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

