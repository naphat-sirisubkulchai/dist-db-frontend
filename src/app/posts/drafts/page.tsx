'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { postService } from '@/services/api';
import type { Post, PaginatedResponse } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';

export default function DraftsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [drafts, setDrafts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchDrafts = async () => {
      try {
        const res = await postService.getDrafts();
        const data = Array.isArray(res) ? res : (res as PaginatedResponse<Post>).data || [];
        setDrafts(data);
      } catch (err) {
        console.error('Failed to fetch drafts', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDrafts();
  }, [user, isLoading, router]);

  if (isLoading || loading) {
    return <div className="container mx-auto py-8 px-4">Loading drafts...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Drafts</h1>
        <Link href="/posts/create">
          <Button>Create Post</Button>
        </Link>
      </header>

      {drafts.length === 0 ? (
        <p className="text-muted-foreground">You don't have any drafts yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drafts.map((post) => (
            <Card key={post.id} className="flex flex-col h-full">
              <CardHeader>
                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                <CardDescription>
                  Last updated {new Date(post.updatedAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground line-clamp-3">
                  {post.excerpt || post.content.substring(0, 150)}...
                </p>
              </CardContent>
              <CardFooter>
                <Link href={`/posts/${post.slug}`} className="w-full">
                  <Button className="w-full" variant="secondary">
                    Continue writing
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
