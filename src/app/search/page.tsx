'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { postService } from '@/services/api';
import type { Post } from '@/types';
import Link from 'next/link';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const searchPosts = async () => {
      if (!query) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Use backend search API
        const response = await postService.search(query, 1, 50);
        const searchResults = response.data?.data || response.data || [];

        setPosts(searchResults);
      } catch (err: any) {
        setError(err.message || 'Failed to search posts');
      } finally {
        setLoading(false);
      }
    };

    searchPosts();
  }, [query]);

  if (loading) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="text-center text-gray-600">Searching...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Search Results
          </h1>
          {query && (
            <p className="text-gray-600">
              Found <span className="font-semibold">{posts.length}</span> result{posts.length !== 1 ? 's' : ''} for "{query}"
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {!query ? (
          <div className="text-center py-16">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h2 className="text-xl text-gray-600">Enter a search query to find posts</h2>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl text-gray-600 mb-2">No posts found</h2>
            <p className="text-gray-500">Try searching with different keywords</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Link key={post._id || post.id} href={`/posts/${post.slug}`}>
                <article className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                  {/* Author Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-xs font-semibold">
                      {post.author.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {post.author.username}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-gray-700">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Meta */}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{post.readTime || 5} min read</span>
                        <span>·</span>
                        <span>{post.likesCount ?? 0} likes</span>
                        <span>·</span>
                        <span>{post.commentsCount ?? 0} comments</span>
                      </div>
                    </div>

                    {/* Cover Image */}
                    {post.coverImage && (
                      <div className="w-32 h-32 flex-shrink-0">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
