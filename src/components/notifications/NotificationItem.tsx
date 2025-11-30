'use client';

import React from 'react';
import Link from 'next/link';
import type { Notification } from '@/types';
import { NotificationType } from '@/types';
import { useNotifications } from '@/context/notification-context';

interface NotificationItemProps {
  notification: Notification;
  onClose: () => void;
  isLast?: boolean;
}

export function NotificationItem({ notification, onClose, isLast }: NotificationItemProps) {
  const { markAsRead, deleteNotification } = useNotifications();

  const handleClick = () => {
    if (!notification.read) {
      markAsRead(notification._id!);
    }
    onClose();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    deleteNotification(notification._id!);
  };

  const getNotificationContent = () => {
    const username = notification.sender.username;

    const getIconBg = () => {
      switch (notification.type) {
        case NotificationType.POST_LIKE:
          return 'bg-gradient-to-br from-pink-500 to-rose-500';
        case NotificationType.COMMENT:
          return 'bg-gradient-to-br from-blue-500 to-cyan-500';
        case NotificationType.COMMENT_REPLY:
          return 'bg-gradient-to-br from-purple-500 to-indigo-500';
        case NotificationType.COMMENT_LIKE:
          return 'bg-gradient-to-br from-amber-500 to-orange-500';
        default:
          return 'bg-gradient-to-br from-gray-500 to-gray-600';
      }
    };

    const getIcon = () => {
      switch (notification.type) {
        case NotificationType.POST_LIKE:
          return (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          );
        case NotificationType.COMMENT:
          return (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
          );
        case NotificationType.COMMENT_REPLY:
          return (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          );
        case NotificationType.COMMENT_LIKE:
          return (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
          );
        default:
          return (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
          );
      }
    };

    const getMessage = () => {
      switch (notification.type) {
        case NotificationType.POST_LIKE:
          return (
            <>
              <span className="font-medium text-gray-900">{username}</span>
              <span className="text-gray-600"> liked your post</span>
              {notification.post && (
                <span className="block text-gray-500 text-xs mt-0.5 line-clamp-1">
                  {notification.post.title}
                </span>
              )}
            </>
          );
        case NotificationType.COMMENT:
          return (
            <>
              <span className="font-medium text-gray-900">{username}</span>
              <span className="text-gray-600"> commented on your post</span>
              {notification.post && (
                <span className="block text-gray-500 text-xs mt-0.5 line-clamp-1">
                  {notification.post.title}
                </span>
              )}
            </>
          );
        case NotificationType.COMMENT_REPLY:
          return (
            <>
              <span className="font-medium text-gray-900">{username}</span>
              <span className="text-gray-600"> replied to your comment</span>
            </>
          );
        case NotificationType.COMMENT_LIKE:
          return (
            <>
              <span className="font-medium text-gray-900">{username}</span>
              <span className="text-gray-600"> liked your comment</span>
            </>
          );
        default:
          return (
            <>
              <span className="font-medium text-gray-900">{username}</span>
              <span className="text-gray-600"> sent you a notification</span>
            </>
          );
      }
    };

    return {
      iconBg: getIconBg(),
      icon: getIcon(),
      message: getMessage(),
      link: notification.post ? `/posts/${notification.post.slug}` : '#',
    };
  };

  const content = getNotificationContent();
  const timeAgo = getTimeAgo(new Date(notification.createdAt));

  return (
    <Link
      href={content.link}
      onClick={handleClick}
      className={`group block px-6 py-4 hover:bg-gray-50 transition-all duration-200 ${
        !notification.read ? 'bg-blue-50/30' : ''
      } ${!isLast ? 'border-b border-gray-100' : ''}`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full ${content.iconBg} flex items-center justify-center shadow-sm`}>
          {content.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm leading-relaxed">{content.message}</p>
          <p className="text-xs text-gray-500 mt-1.5">{timeAgo}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Delete button */}
          <button
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 flex-shrink-0 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
            aria-label="Delete notification"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Unread indicator */}
          {!notification.read && (
            <div className="flex-shrink-0 w-2 h-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-sm"></div>
          )}
        </div>
      </div>
    </Link>
  );
}

// Helper function to format time ago
function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + 'y ago';

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + 'mo ago';

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + 'd ago';

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + 'h ago';

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + 'm ago';

  return Math.floor(seconds) + 's ago';
}
