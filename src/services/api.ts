import type { PaginatedResponse, Post, Comment } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface FetchOptions extends RequestInit {
  token?: string;
}

export async function fetchClient<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, headers, ...rest } = options;
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Check if we are running on the client side to get token from localStorage if not provided
  if (!token && typeof window !== 'undefined') {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      defaultHeaders['Authorization'] = `Bearer ${storedToken}`;
    }
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    ...rest,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Something went wrong');
  }

  return data as T;
}

export const authService = {
  async login(credentials: any) {
    return fetchClient<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async register(credentials: any) {
    return fetchClient<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async getMe(token?: string) {
    return fetchClient<any>('/auth/me', { token });
  },
};

export const postService = {
  async getAll(page = 1, limit = 10) {
    return fetchClient<any>(`/posts?page=${page}&limit=${limit}`);
  },

  async getFeed(page = 1, limit = 10) {
    return fetchClient<any>(`/posts/feed?page=${page}&limit=${limit}`);
  },

  async getBySlug(slug: string) {
    return fetchClient<any>(`/posts/${slug}`);
  },

  async create(postData: any) {
    return fetchClient<any>('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  },

  async like(postId: string) {
    return fetchClient<{ likesCount: number; isLiked?: boolean }>(`/posts/${postId}/like`, {
      method: 'POST',
    });
  },

  async getDrafts(page = 1, limit = 10) {
    return fetchClient<any>(`/posts/my/drafts?page=${page}&limit=${limit}`);
  },
};

export const commentService = {
  async getForPost(postId: string, page = 1, limit = 20) {
    return fetchClient<PaginatedResponse<Comment>>(`/comments/post/${postId}?page=${page}&limit=${limit}`);
  },

  async create(postId: string, content: string, parentCommentId?: string) {
    return fetchClient<Comment>('/comments', {
      method: 'POST',
      body: JSON.stringify({ postId, content, parentCommentId }),
    });
  },

  async like(commentId: string) {
    return fetchClient<{ likesCount: number }>(`/comments/${commentId}/like`, {
      method: 'POST',
    });
  },
};
