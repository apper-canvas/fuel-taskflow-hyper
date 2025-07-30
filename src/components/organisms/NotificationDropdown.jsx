import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import { 
  fetchNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  setDropdownOpen 
} from '@/store/notificationSlice';
import { formatDistanceToNow } from 'date-fns';

const NotificationDropdown = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  
  const { notifications, loading, unreadCount } = useSelector(state => state.notifications);
  const { user } = useSelector(state => state.user);

  useEffect(() => {
    if (isOpen && user?.userId) {
      dispatch(fetchNotifications({ 
        recipient: user.userId, 
        limit: 10 
      }));
    }
  }, [isOpen, dispatch, user?.userId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleMarkAsRead = async (notificationId, event) => {
    event.stopPropagation();
    try {
      await dispatch(markNotificationAsRead(notificationId));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (user?.userId && unreadCount > 0) {
      try {
        await dispatch(markAllNotificationsAsRead(user.userId));
      } catch (error) {
        console.error('Error marking all notifications as read:', error);
      }
    }
  };

  const handleViewAll = () => {
    navigate('/notifications');
    onClose();
  };

  const getNotificationIcon = (relatedEntity) => {
    switch (relatedEntity?.toLowerCase()) {
      case 'job':
        return 'Briefcase';
      case 'candidate':
        return 'User';
      case 'application':
        return 'FileText';
      case 'interview':
        return 'Calendar';
      default:
        return 'Bell';
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-h-80 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <ApperIcon name="Bell" size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.slice(0, 10).map((notification) => (
              <div
                key={notification.Id}
                className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                  notification.status === 'unread' ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleMarkAsRead(notification.Id, { stopPropagation: () => {} })}
              >
                <div className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    notification.status === 'unread' 
                      ? 'bg-primary-100 text-primary-600' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <ApperIcon 
                      name={getNotificationIcon(notification.relatedEntity)} 
                      size={16} 
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${
                      notification.status === 'unread' 
                        ? 'text-gray-900 font-medium' 
                        : 'text-gray-600'
                    }`}>
                      {notification.content}
                    </p>
                    
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                      </p>
                      
                      {notification.status === 'unread' && (
                        <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={handleViewAll}
            className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium py-2"
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;