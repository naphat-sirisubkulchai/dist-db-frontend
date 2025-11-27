'use client';

import { useEffect, useState } from 'react';
import { postService } from '@/services/api';
import type { Post, PaginatedResponse } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await postService.getAll();
        console.log('Backend response:', response);
        // Backend returns { success: true, data: { data: [...], pagination: {...} } }
        // So the actual posts array is at response.data.data
        const postsData = response?.data?.data || response?.data || [];
        setPosts(Array.isArray(postsData) ? postsData : []);
      } catch (error) {
        console.error('Failed to fetch posts', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Safety check to ensure posts is always an array
  const safePosts = Array.isArray(posts) ? posts : [];

  return (
    <div className="min-h-screen bg-white">
      {/* Medium-style Header */}
      <header className="border-b border-black bg-white sticky top-0 z-50">
        <div className="max-w-[1336px] mx-auto flex justify-between items-center py-6 px-6">
          <Link href="/" className="flex items-center gap-2">
            <h1 className="text-[32px] font-serif font-bold tracking-tight cursor-pointer hover:opacity-80 transition">
              Medium
            </h1>
          </Link>
          <div className="flex items-center gap-6">
            {user ? (
              <>
                <Link href="/posts/create" className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Write
                </Link>
                <button onClick={logout} className="text-sm text-gray-600 hover:text-gray-900">
                  Sign out
                </button>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-sm font-semibold cursor-pointer">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
                  Sign in
                </Link>
                <Link href="/register">
                  <button className="bg-black text-white hover:bg-gray-800 rounded-full px-4 py-2 text-sm font-medium transition">
                    Get started
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="border-b border-black bg-[#FFC017]">
        <div className="max-w-[1336px] mx-auto py-20 px-6">
          <div className="max-w-[550px]">
            <h2 className="text-[106px] font-serif font-normal mb-8 leading-[95px] tracking-tight">
              Stay curious.
            </h2>
            <p className="text-[24px] text-gray-900 mb-12 leading-tight">
              Discover stories, thinking, and expertise from writers on any topic.
            </p>
            {!user && (
              <Link href="/register">
                <button className="bg-gray-900 text-white hover:bg-black rounded-full px-12 py-3 text-[20px] font-medium transition">
                  Start reading
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-[1336px] mx-auto py-16 px-6">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading...</div>
        ) : safePosts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl">No stories yet.</p>
            <p className="text-gray-400 mt-2">Be the first to write!</p>
          </div>
        ) : (
          <div className="max-w-[680px] mx-auto">
            {safePosts.map((post, index) => (
              <article key={post._id || post.id || index} className="py-10 border-b border-gray-200 last:border-0">
                <Link href={`/posts/${post.slug}`} className="group block">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                      {post.author?.username?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <span className="text-[13px] font-medium text-gray-900">
                      {post.author?.username || 'Anonymous'}
                    </span>
                  </div>

                  <div className="flex gap-10 items-start">
                    <div className="flex-1">
                      <h2 className="text-[22px] font-bold text-gray-900 mb-2 group-hover:text-gray-600 transition leading-7 font-serif">
                        {post.title}
                      </h2>
                      <p className="text-gray-600 text-[16px] mb-4 line-clamp-2 leading-5">
                        {post.excerpt || post.content.substring(0, 140)}...
                      </p>
                      <div className="flex items-center gap-4 text-[13px] text-gray-500">
                        <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        <span>·</span>
                        <span>{post.readTime || 5} min read</span>
                        {post.tags && post.tags.length > 0 && (
                          <>
                            <span>·</span>
                            <span className="px-2 py-1 bg-gray-100 rounded-full text-[12px] text-gray-700">
                              {post.tags[0]}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    {post.coverImage && (
                      <div className="flex-shrink-0 w-[112px] h-[112px]">
                        <img 
                          src={post.coverImage} 
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-20">
        <div className="max-w-[1336px] mx-auto py-12 px-6">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <p>© 2024 Medium Clone</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-gray-900">Help</a>
              <a href="#" className="hover:text-gray-900">About</a>
              <a href="#" className="hover:text-gray-900">Terms</a>
              <a href="#" className="hover:text-gray-900">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
