import type { PaginatedResponse, Post, Comment } from '@/types';
import type { Notification } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000';

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

  if (!response.ok) {
    let errorMessage = 'Something went wrong';
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        errorMessage = data.error || data.message || errorMessage;
      } else {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
    } catch (e) {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
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

  async getById(id: string) {
    return fetchClient<any>(`/posts/id/${id}`);
  },

  async getByUser(userId: string, page = 1, limit = 100) {
    return fetchClient<any>(`/posts/user/${userId}?page=${page}&limit=${limit}`);
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

  async save(postId: string) {
    return fetchClient<{ saved: boolean }>(`/posts/${postId}/save`, {
      method: 'POST',
    });
  },

  async getSavedPosts(page = 1, limit = 100) {
    return fetchClient<any>(`/posts/saved?page=${page}&limit=${limit}`);
  },

  async update(postId: string, postData: any) {
    return fetchClient<any>(`/posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  },

  async delete(postId: string) {
    return fetchClient<{ success: boolean; message: string }>(`/posts/${postId}`, {
      method: 'DELETE',
    });
  },
};

export const userService = {
  async getProfile(userId: string) {
    return fetchClient<any>(`/users/id/${userId}`);
  },

  async getProfileByUsername(username: string) {
    return fetchClient<any>(`/users/${username}`);
  },

  async follow(username: string) {
    return fetchClient<{
      data: { following: boolean; }; following: boolean 
}>(`/users/${username}/follow`, {
      method: 'POST',
    });
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

export const notificationService = {
  async getAll(limit = 20, skip = 0) {
    return fetchClient<{ success: boolean; data: Notification[] }>(
      `/notifications?limit=${limit}&skip=${skip}`
    );
  },

  async getUnreadCount() {
    return fetchClient<{ success: boolean; data: { count: number } }>(
      '/notifications/unread-count'
    );
  },

  async markAsRead(notificationId: string) {
    return fetchClient<{ success: boolean; data: Notification }>(
      `/notifications/${notificationId}/read`,
      {
        method: 'PATCH',
      }
    );
  },

  async markAllAsRead() {
    return fetchClient<{ success: boolean; message: string }>(
      '/notifications/read-all',
      {
        method: 'PATCH',
      }
    );
  },

  async delete(notificationId: string) {
    return fetchClient<{ success: boolean; message: string }>(
      `/notifications/${notificationId}`,
      {
        method: 'DELETE',
      }
    );
  },
};
