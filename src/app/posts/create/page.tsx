'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { postService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';
import { RichTextEditor } from '@/components/RichtextEditor';

export default function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  // Redirect to login if not authenticated (after auth loading completes)
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload image');
    }

    const data = await response.json();
    return data.data.url;
  };

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

      let finalCoverImage = coverImage;

      // Upload image if file is selected
      if (imageFile) {
        setUploadingImage(true);
        try {
          const uploadedUrl = await uploadImage(imageFile);
          finalCoverImage = `${process.env.NEXT_PUBLIC_API_URL}${uploadedUrl}`;
        } catch (uploadError: any) {
          throw new Error(`Image upload failed: ${uploadError.message}`);
        } finally {
          setUploadingImage(false);
        }
      }

      await postService.create({
        title,
        content,
        tags: tagsArray,
        coverImage: finalCoverImage || undefined,
        published: true
      });

      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <Card className="bg-white border-gray-200">
          <CardContent className="py-8">
            <div className="text-center text-gray-600">Loading...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Don't render form if not authenticated (will redirect via useEffect)
  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Create New Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-700 font-medium">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
                required
                minLength={3}
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverImage" className="text-gray-700 font-medium">Cover Image (Optional)</Label>

              {/* File upload */}
              <div className="space-y-3">
                <input
                  id="coverImageFile"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none file:mr-4 file:py-2.5 file:px-4 file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                />

                {/* Image preview */}
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Cover preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview('');
                      }}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}

                <p className="text-xs text-gray-500">Or paste an image URL below (max 5MB, JPEG/PNG/GIF/WebP)</p>

                {/* URL input as fallback */}
                <Input
                  id="coverImage"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  type="url"
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags" className="text-gray-700 font-medium">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="tech, lifestyle, coding"
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label>Content</Label>
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Tell your story..."
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()} className="border-gray-300 text-gray-700 hover:bg-gray-50" disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || uploadingImage} className="bg-gray-900 hover:bg-black text-white">
                {uploadingImage ? 'Uploading image...' : loading ? 'Creating...' : 'Publish Post'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
