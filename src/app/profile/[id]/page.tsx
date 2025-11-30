'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { userService, postService } from '@/services/api';
import { useAuth } from '@/context/auth-context';
import type { User, Post } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type TabType = 'posts' | 'savedPosts' | 'info';

export default function ProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('posts');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const isOwnProfile = currentUser?._id === userId;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch user profile
        const userResponse = await userService.getProfile(userId);
        const userData = userResponse.data;
        setUser(userData);

        // Set stats if available (from getUserProfile endpoint with stats)
        if ((userData as any).stats) {
          setFollowerCount((userData as any).stats.followers || 0);
          setFollowingCount((userData as any).stats.following || 0);
        }

        // Set following status
        if ((userData as any).isFollowing !== undefined) {
          setIsFollowing((userData as any).isFollowing);
        }

        // Fetch user's posts
        const postsResponse = await postService.getByUser(userId);

        // Handle different response structures
        let postsData = [];
        if (postsResponse.data) {
          if (Array.isArray(postsResponse.data)) {
            postsData = postsResponse.data;
          } else if (postsResponse.data.posts && Array.isArray(postsResponse.data.posts)) {
            postsData = postsResponse.data.posts;
          } else if (postsResponse.data.data && Array.isArray(postsResponse.data.data)) {
            postsData = postsResponse.data.data;
          }
        }
        setPosts(postsData);

        // Fetch saved posts if viewing own profile
        if (isOwnProfile) {
          try {
            const savedResponse = await postService.getSavedPosts();
            let savedData = [];
            if (savedResponse.data) {
              if (Array.isArray(savedResponse.data)) {
                savedData = savedResponse.data;
              } else if (savedResponse.data.posts && Array.isArray(savedResponse.data.posts)) {
                savedData = savedResponse.data.posts;
              } else if (savedResponse.data.data && Array.isArray(savedResponse.data.data)) {
                savedData = savedResponse.data.data;
              }
            }
            setSavedPosts(savedData);
          } catch (err) {
            console.error('Failed to fetch saved posts:', err);
            // Not critical, just set to empty array
            setSavedPosts([]);
          }
        }
      } catch (err: any) {
        console.error('Failed to fetch profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, isOwnProfile]);

  const handleFollow = async () => {
    if (!user || !currentUser) return;

    try {
      const response = await userService.follow(user.username);
      const result = response.data || response;
      setIsFollowing(result.following);

      // Update follower count
      setFollowerCount((prev) => result.following ? prev + 1 : prev - 1);
    } catch (err) {
      console.error('Failed to follow/unfollow user', err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="text-center text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="text-center text-red-600">{error || 'User not found'}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* User Header */}
      <div className="mb-8">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
            {user.username?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-4xl font-bold text-gray-900">{user.username}</h1>
              {!isOwnProfile && currentUser && (
                <Button
                  onClick={handleFollow}
                  variant={isFollowing ? "outline" : "default"}
                  className={isFollowing ? "border-gray-300 text-gray-700 hover:bg-gray-50" : "bg-gray-900 hover:bg-black text-white"}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
              )}
            </div>
            <p className="text-gray-600">{user.email}</p>
            {user.bio && <p className="text-gray-700 mt-2">{user.bio}</p>}
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-8 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">{Array.isArray(posts) ? posts.length : 0}</div>
            <div className="text-sm text-gray-600">Posts</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{followerCount}</div>
            <div className="text-sm text-gray-600">Followers</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{followingCount}</div>
            <div className="text-sm text-gray-600">Following</div>
          </div>
        </div>
      </div>

      {/* Tabs (only for own profile) */}
      {isOwnProfile && (
        <div className="border-b border-gray-200 mb-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('posts')}
              className={`pb-4 px-2 font-medium transition-colors ${
                activeTab === 'posts'
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Your Posts
            </button>
            <button
              onClick={() => setActiveTab('savedPosts')}
              className={`pb-4 px-2 font-medium transition-colors ${
                activeTab === 'savedPosts'
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Saved Posts
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className={`pb-4 px-2 font-medium transition-colors ${
                activeTab === 'info'
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Information
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      {(activeTab === 'posts' || !isOwnProfile) && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {isOwnProfile ? 'Your Posts' : `${user.username}'s Posts`}
          </h2>
          {!Array.isArray(posts) || posts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {isOwnProfile ? (
                <>
                  <p className="mb-4">You haven't written any posts yet</p>
                  <Link href="/posts/create">
                    <Button className="bg-gray-900 hover:bg-black text-white">Write Your First Post</Button>
                  </Link>
                </>
              ) : (
                <p>No posts yet</p>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {Array.isArray(posts) && posts.map((post) => (
                <Link key={post._id} href={`/posts/${post.slug}`}>
                  <article className="border-b border-gray-200 pb-6 hover:opacity-75 transition cursor-pointer">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.content}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          <span>·</span>
                          <span>{post.likesCount || 0} likes</span>
                          <span>·</span>
                          <span>{post.commentsCount || 0} comments</span>
                          {post.tags && post.tags.length > 0 && (
                            <>
                              <span>·</span>
                              <span className="px-2 py-1 bg-gray-100 rounded-full text-gray-700">
                                {post.tags[0]}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      {post.coverImage && (
                        <div className="flex-shrink-0 w-32 h-32">
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
      )}

      {isOwnProfile && activeTab === 'savedPosts' && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Saved Posts</h2>
          {!Array.isArray(savedPosts) || savedPosts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No saved posts yet</p>
              <p className="text-sm mt-2">Click the bookmark icon on any post to save it here</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Array.isArray(savedPosts) && savedPosts.map((post) => (
                <Link key={post._id} href={`/posts/${post.slug}`}>
                  <article className="border-b border-gray-200 pb-6 hover:opacity-75 transition cursor-pointer">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.content}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          <span>·</span>
                          <span>{post.likesCount || 0} likes</span>
                          <span>·</span>
                          <span>{post.commentsCount || 0} comments</span>
                          {post.tags && post.tags.length > 0 && (
                            <>
                              <span>·</span>
                              <span className="px-2 py-1 bg-gray-100 rounded-full text-gray-700">
                                {post.tags[0]}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      {post.coverImage && (
                        <div className="flex-shrink-0 w-32 h-32">
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
      )}

      {isOwnProfile && activeTab === 'info' && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Information</h2>
          <Card className="bg-white border-gray-200">
            <CardContent className="py-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Username</label>
                <p className="text-gray-900 mt-1">{user.username}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900 mt-1">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Bio</label>
                <p className="text-gray-900 mt-1">{user.bio || 'No bio yet'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Member Since</label>
                <p className="text-gray-900 mt-1">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="pt-4">
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
