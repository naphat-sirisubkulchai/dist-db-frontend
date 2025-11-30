'use client';

import { useNotifications } from '@/context/notification-context';
import { NotificationItem } from './NotificationItem';

interface NotificationListProps {
  onClose: () => void;
}

export function NotificationList({ onClose }: NotificationListProps) {
  const { notifications, isLoading, markAllAsRead, loadMore, hasMore } = useNotifications();

  return (
    <div className="flex flex-col max-h-[500px]">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <h3 className="text-base font-semibold text-gray-900">Notifications</h3>
        {notifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs text-gray-500 hover:text-gray-900 font-medium transition-colors"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Notification List */}
      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-600 font-medium">All caught up!</p>
            <p className="text-xs text-gray-500 mt-1">No new notifications</p>
          </div>
        ) : (
          <>
            {notifications.map((notification, index) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onClose={onClose}
                isLast={index === notifications.length - 1}
              />
            ))}

            {/* Load More Button */}
            {hasMore && (
              <div className="px-6 py-4 border-t border-gray-100">
                <button
                  onClick={loadMore}
                  disabled={isLoading}
                  className="w-full text-sm text-gray-600 hover:text-gray-900 font-medium disabled:text-gray-400 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    'Show more'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
