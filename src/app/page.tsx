'use client';

import { useEffect, useState } from 'react';
import { postService } from '@/services/api';
import type { Post } from '@/types';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { getExcerpt } from '@/lib/getExcerpt';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

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
      {/* Hero Section - Only show for non-logged-in users */}
      {!user && (
        <div className="border-b border-black bg-[#FFC017]">
          <div className="max-w-[1336px] mx-auto py-20 px-6">
            <div className="max-w-[550px]">
              <h2 className="text-[106px] font-serif font-normal mb-8 leading-[95px] tracking-tight">
                Stay curious.
              </h2>
              <p className="text-[24px] text-gray-900 mb-12 leading-tight">
                Discover stories, thinking, and expertise from writers on any topic.
              </p>
              <Link href="/register">
                <button className="bg-gray-900 text-white hover:bg-black rounded-full px-12 py-3 text-[20px] font-medium transition">
                  Start reading
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-[1336px] mx-auto pt-8 pb-16 px-6">
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
                <Link
                  href={`/profile/${post.author?._id}`}
                  className="flex items-center gap-2 mb-4 hover:opacity-75 transition w-fit"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                    {post.author?.username?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <span className="text-[13px] font-medium text-gray-900">
                    {post.author?.username || 'Anonymous'}
                  </span>
                </Link>
                <Link href={`/posts/${post.slug}`} className="group block">

                  <div className="flex gap-10 items-start">
                    <div className="flex-1">
                      <h2 className="text-[22px] font-bold text-gray-900 mb-2 group-hover:text-gray-600 transition leading-7 font-serif">
                        {post.title}
                      </h2>
                      <div
                        className="tiptap-editor prose prose-sm max-w-none line-clamp-2 overflow-hidden prose-p:m-0 prose-headings:m-0 prose-li:m-0 prose-blockquote:m-0"
                        dangerouslySetInnerHTML={{
                          __html: getExcerpt(post.content, 200),
                        }}
                      />
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
    </div>
  );
}
