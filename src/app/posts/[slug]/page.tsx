'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { commentService, postService } from '@/services/api';
import type { Post, Comment, PaginatedResponse } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const { user } = useAuth();

  // Organize comments into parent-child structure
  const organizeComments = (comments: Comment[]) => {
    const parentComments = comments.filter(c => !c.parentComment);
    const repliesMap = new Map<string, Comment[]>();

    comments.forEach(c => {
      if (c.parentComment) {
        const parentId = c.parentComment;
        if (!repliesMap.has(parentId)) {
          repliesMap.set(parentId, []);
        }
        repliesMap.get(parentId)?.push(c);
      }
    });

    return { parentComments, repliesMap };
  };

  useEffect(() => {
    const fetchPost = async () => {
      if (!params.slug) return;

      try {
        const response = await postService.getBySlug(params.slug as string);
        console.log('Post response:', response);
        // Backend returns { success: true, data: post }
        const postData = response?.data || response;
        setPost(postData);

        // Use _id if id is not present (MongoDB format)
        const postId = postData?._id || postData?.id;
        if (postId) {
          const commentsRes: any = await commentService.getForPost(postId);
          // Backend returns { success: true, data: { data: [...], pagination } }
          const commentsData = commentsRes?.data?.data || commentsRes?.data || [];
          setComments(Array.isArray(commentsData) ? commentsData : []);
        }
      } catch (err) {
        console.error('Failed to fetch post', err);
        setError('Post not found');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.slug]);

  const handleLikePost = async () => {
    if (!post) return;
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      const postId = post._id || post.id;
      if (!postId) return;
      const res: any = await postService.like(postId);
      // Backend returns { success: true, data: { liked: boolean, likesCount: number } }
      const result = res?.data || res;
      setPost((prev) => (prev ? { ...prev, likesCount: result.likesCount, isLiked: result.liked } : prev));
    } catch (err) {
      console.error('Failed to like post', err);
    }
  };

  const handleSavePost = async () => {
    if (!post) return;
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      const postId = post._id || post.id;
      if (!postId) return;
      const res: any = await postService.save(postId);
      // Backend returns { success: true, data: { saved: boolean } }
      const result = res?.data || res;
      setPost((prev) => (prev ? { ...prev, isSaved: result.saved } : prev));
    } catch (err) {
      console.error('Failed to save post', err);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;
    if (!user) {
      router.push('/login');
      return;
    }

    setCommentLoading(true);
    try {
      const postId = post._id || post.id;
      if (!postId) return;
      const response: any = await commentService.create(postId, commentContent);
      console.log('Comment response:', response);
      // Backend returns { success: true, data: comment }
      const commentData = response?.data || response;
      setComments((prev) => [commentData, ...prev]);
      setCommentContent('');
    } catch (err) {
      console.error('Failed to add comment', err);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      const res: any = await commentService.like(commentId);
      // Backend returns { success: true, data: { liked: boolean, likesCount: number } }
      const result = res?.data || res;
      setComments((prev) =>
        prev.map((c) =>
          (c._id || c.id) === commentId ? { ...c, likesCount: result.likesCount, isLiked: result.liked } : c
        )
      );
    } catch (err) {
      console.error('Failed to like comment', err);
    }
  };

  const handleReplySubmit = async (e: React.FormEvent, parentCommentId: string) => {
    e.preventDefault();
    if (!post || !user) return;

    setCommentLoading(true);
    try {
      const postId = post._id || post.id;
      if (!postId) return;
      const response: any = await commentService.create(postId, replyContent, parentCommentId);
      const commentData = response?.data || response;
      setComments((prev) => [commentData, ...prev]);
      setReplyContent('');
      setReplyingTo(null);
    } catch (err) {
      console.error('Failed to add reply', err);
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto py-10 text-center">Loading post...</div>;
  }

  if (error || !post) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">{error || 'Post not found'}</h2>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <article className="max-w-[680px] mx-auto px-6 py-16">
        {/* Title */}
        <h1 className="text-[42px] font-serif font-bold mb-2 leading-[52px] text-gray-900">{post.title}</h1>

        {/* Author Info */}
        <div className="flex items-center gap-4 py-8 border-b border-gray-200 mb-8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-lg font-semibold">
            {post.author.avatar ? (
              <img src={post.author.avatar} alt={post.author.username} className="w-full h-full object-cover rounded-full" />
            ) : (
              <span>{post.author.username.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-medium text-gray-900">{post.author.username}</span>
            </div>
            <div className="flex items-center gap-2 text-[14px] text-gray-500">
              <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span>·</span>
              <span>{post.readTime || 5} min read</span>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between py-4 border-b border-gray-200 mb-8">
          <div className="flex items-center gap-6">
            <button
              onClick={handleLikePost}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition"
            >
              <svg className="w-6 h-6" fill={post.isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={post.isLiked ? 0 : 2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-sm">{post.likesCount ?? 0}</span>
            </button>
            <button className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-sm">{comments.length}</span>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleSavePost}
              className="text-gray-500 hover:text-gray-900 transition"
            >
              <svg className="w-6 h-6" fill={(post as any).isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={(post as any).isSaved ? 0 : 2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="mb-12">
            <img src={post.coverImage} alt={post.title} className="w-full h-auto" />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-12 prose-headings:font-serif prose-headings:font-bold prose-blockquote:border-gray-300 prose-blockquote:pl-6 prose-li:marker:text-gray-600">
          <div
            className="tiptap-editor"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-3 py-8 border-t border-b border-gray-200 mb-12">
            {post.tags.map((tag) => (
              <span key={tag} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-[14px] hover:bg-gray-200 cursor-pointer transition">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Comments Section */}
        <section className="mt-16">
          <h3 className="text-[24px] font-bold mb-8 text-gray-900">Responses ({comments.length})</h3>

          {user ? (
            <form onSubmit={handleAddComment} className="mb-12">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <textarea
                    className="w-full border-0 border-b-2 border-gray-200 focus:border-gray-900 outline-none text-[16px] py-2 resize-none"
                    placeholder="What are your thoughts?"
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    rows={3}
                    required
                  />
                  <div className="flex justify-end mt-4">
                    <button
                      type="submit"
                      disabled={commentLoading}
                      className="bg-green-600 text-white hover:bg-green-700 rounded-full px-6 py-2 text-sm font-medium transition disabled:opacity-50"
                    >
                      {commentLoading ? 'Posting...' : 'Respond'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="text-center py-8 border border-gray-200 rounded-lg mb-12">
              <p className="text-gray-600 mb-4">Sign in to leave a response</p>
              <Link href="/login">
                <button className="bg-black text-white hover:bg-gray-800 rounded-full px-6 py-2 text-sm font-medium transition">
                  Sign in
                </button>
              </Link>
            </div>
          )}

          {comments.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No responses yet</p>
          ) : (
            <div className="space-y-8">
              {organizeComments(comments).parentComments.map((c) => {
                const { repliesMap } = organizeComments(comments);
                const replies = repliesMap.get(c._id || c.id || '') || [];

                return (
                  <div key={c._id || c.id}>
                    {/* Parent Comment */}
                    <div key={c._id || c.id} className="pb-8 border-b border-gray-200 last:border-0">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                          {c.author.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-gray-900">{c.author.username}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <p className="text-[16px] text-gray-900 leading-6 whitespace-pre-wrap mb-3">{c.content}</p>

                          {/* Comment Actions */}
                          <div className="flex items-center gap-6 text-sm">
                            <button
                              onClick={() => handleLikeComment(c._id || c.id || '')}
                              className={`flex items-center gap-2 transition ${c.isLiked ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                              <svg className="w-5 h-5" fill={c.isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={c.isLiked ? 0 : 2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                              <span>{c.likesCount || 0}</span>
                            </button>
                            {user && (
                              <button
                                onClick={() => setReplyingTo(replyingTo === (c._id || c.id) ? null : (c._id || c.id || ''))}
                                className="text-gray-500 hover:text-gray-900 transition"
                              >
                                Reply
                              </button>
                            )}
                          </div>

                          {/* Reply Form */}
                          {replyingTo === (c._id || c.id) && user && (
                            <form onSubmit={(e) => handleReplySubmit(e, c._id || c.id || '')} className="mt-4 ml-0">
                              <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                                  {user.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                  <textarea
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-gray-900 outline-none resize-none"
                                    placeholder="Write a reply..."
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    rows={2}
                                    required
                                  />
                                  <div className="flex gap-2 mt-2">
                                    <button
                                      type="submit"
                                      disabled={commentLoading}
                                      className="bg-green-600 text-white hover:bg-green-700 rounded-full px-4 py-1 text-xs font-medium transition disabled:opacity-50"
                                    >
                                      {commentLoading ? 'Posting...' : 'Reply'}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setReplyingTo(null);
                                        setReplyContent('');
                                      }}
                                      className="text-gray-600 hover:text-gray-900 text-xs"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </form>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Replies to this comment */}
                    {replies.length > 0 && (
                      <div className="ml-14 mt-6 space-y-6 border-l-2 border-gray-100 pl-6">
                        {replies.map((reply) => (
                          <div key={reply._id || reply.id} className="pb-6 border-b border-gray-100 last:border-0">
                            <div className="flex gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-cyan-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                                {reply.author.username.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-sm font-medium text-gray-900">{reply.author.username}</span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(reply.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  </span>
                                  <span className="text-xs text-gray-400">· Reply</span>
                                </div>
                                <p className="text-sm text-gray-900 leading-6 whitespace-pre-wrap mb-2">{reply.content}</p>

                                {/* Reply Actions */}
                                <button
                                  onClick={() => handleLikeComment(reply._id || reply.id || '')}
                                  className={`flex items-center gap-2 transition text-xs ${reply.isLiked ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                  <svg className="w-4 h-4" fill={reply.isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={reply.isLiked ? 0 : 2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                  </svg>
                                  <span>{reply.likesCount || 0}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </article>
    </div>
  );
}
