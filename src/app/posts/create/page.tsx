'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { postService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';

export default function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to create a post');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      
      await postService.create({
        title,
        content,
        tags: tagsArray,
        published: true
      });

      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  if (!user && typeof window !== 'undefined') {
    router.push('/login');
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create New Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
                required
                minLength={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <textarea
                id="content"
                className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post content here..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="tech, lifestyle, coding"
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Publish Post'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
