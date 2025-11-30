'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { Notification } from '@/types';
import { notificationService, WS_URL } from '@/services/api';
import { useAuth } from './auth-context';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { token, user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);

  // Fetch initial notifications
  const fetchNotifications = useCallback(async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      const [notifResponse, countResponse] = await Promise.all([
        notificationService.getAll(20, 0),
        notificationService.getUnreadCount(),
      ]);

      setNotifications(notifResponse.data);
      setUnreadCount(countResponse.data.count);
      setHasMore(notifResponse.data.length === 20);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Load more notifications
  const loadMore = useCallback(async () => {
    if (!token || !hasMore || isLoading) return;

    try {
      setIsLoading(true);
      const response = await notificationService.getAll(20, notifications.length);

      if (response.data.length < 20) {
        setHasMore(false);
      }

      setNotifications(prev => [...prev, ...response.data]);
    } catch (error) {
      console.error('Failed to load more notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [token, hasMore, isLoading, notifications.length]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);

      setNotifications(prev =>
        prev.map(n => (n._id === notificationId ? { ...n, read: true } : n))
      );

      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();

      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      await notificationService.delete(notificationId);

      setNotifications(prev => {
        const notification = prev.find(n => n._id === notificationId);
        if (notification && !notification.read) {
          setUnreadCount(count => Math.max(0, count - 1));
        }
        return prev.filter(n => n._id !== notificationId);
      });
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  }, []);

  // WebSocket connection - graceful fallback to HTTP polling
  useEffect(() => {
    if (!token || !user) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      return;
    }

    // Try to connect to WebSocket (optional enhancement, app works fine without it)
    let ws: WebSocket | null = null;

    try {
      ws = new WebSocket(`${WS_URL}/ws?token=${token}`);

      ws.onopen = () => {
        // WebSocket connected - real-time notifications enabled
        if (process.env.NODE_ENV === 'development') {
          console.log('✓ Real-time notifications connected');
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'notification') {
            // Add new notification to the list
            setNotifications(prev => [data.data, ...prev]);
            setUnreadCount(prev => prev + 1);

            // Optional: Show browser notification
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('New notification', {
                body: getNotificationMessage(data.data),
                icon: '/favicon.ico',
              });
            }
          }
        } catch (error) {
          // Silently ignore parse errors
        }
      };

      ws.onerror = () => {
        // Silently handle WebSocket errors - app works fine with HTTP polling
        // No need to log errors as this is an optional enhancement
      };

      ws.onclose = () => {
        // WebSocket closed - app continues to work via HTTP polling
      };

      wsRef.current = ws;
    } catch (error) {
      // Failed to create WebSocket - app continues to work via HTTP polling
    }

    // Cleanup
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [token, user]);

  // Fetch notifications on mount
  useEffect(() => {
    if (token) {
      fetchNotifications();
    }
  }, [token, fetchNotifications]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        loadMore,
        hasMore,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

// Helper function to generate notification message
function getNotificationMessage(notification: Notification): string {
  const username = notification.sender.username;

  switch (notification.type) {
    case 'post_like':
      return `${username} liked your post`;
    case 'comment':
      return `${username} commented on your post`;
    case 'comment_reply':
      return `${username} replied to your comment`;
    case 'comment_like':
      return `${username} liked your comment`;
    default:
      return 'You have a new notification';
  }
}
