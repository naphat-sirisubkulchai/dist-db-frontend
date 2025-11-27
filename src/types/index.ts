export interface User {
  id?: string;
  _id?: string;
  username: string;
  email: string;
  name?: string;
  bio?: string;
  avatar?: string;
  createdAt: string;
}

export interface Post {
  id?: string;
  _id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  author: User;
  tags: string[];
  published: boolean;
  likesCount: number;
  commentsCount: number;
  readTime?: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface LoginCredentials {
  emailOrUsername: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  name?: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  tags?: string[];
  coverImage?: string;
  published?: boolean;
}

export interface Comment {
  id?: string;
  _id?: string;
  content: string;
  author: User;
  post: string;
  parentComment?: string;
  likesCount: number;
  createdAt: string;
  updatedAt: string;
}
