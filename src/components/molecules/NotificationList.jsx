import React from 'react';
import { useDispatch } from 'react-redux';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import { markNotificationAsRead } from '@/store/notificationSlice';
import { formatDistanceToNow } from 'date-fns';

const NotificationList = ({ notifications, loading, onMarkAsRead }) => {
  const dispatch = useDispatch();

  const handleMarkAsRead = async (notificationId) => {
    try {
      await dispatch(markNotificationAsRead(notificationId));
      if (onMarkAsRead) {
        onMarkAsRead(notificationId);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
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

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'unread':
        return 'default';
      case 'read':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-start space-x-4 p-4 bg-white rounded-lg border animate-pulse">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border">
        <ApperIcon name="Bell" size={64} className="text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
        <p className="text-gray-500">You're all caught up! No new notifications to display.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <div
          key={notification.Id}
          className={`p-4 bg-white rounded-lg border transition-all duration-200 hover:shadow-md ${
            notification.status === 'unread' 
              ? 'border-l-4 border-l-primary-500 bg-blue-50/50' 
              : 'border-gray-200'
          }`}
        >
          <div className="flex items-start justify-between space-x-4">
            <div className="flex items-start space-x-3 flex-1">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                notification.status === 'unread' 
                  ? 'bg-primary-100 text-primary-600' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                <ApperIcon 
                  name={getNotificationIcon(notification.relatedEntity)} 
                  size={20} 
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={`text-sm leading-relaxed ${
                  notification.status === 'unread' 
                    ? 'text-gray-900 font-medium' 
                    : 'text-gray-700'
                }`}>
                  {notification.content}
                </p>
                
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-3">
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                    </p>
                    
                    {notification.relatedEntity && (
                      <Badge variant="outline" className="text-xs">
                        {notification.relatedEntity}
                      </Badge>
                    )}
                  </div>
                  
                  <Badge variant={getStatusBadgeVariant(notification.status)} className="text-xs">
                    {notification.status}
                  </Badge>
                </div>
              </div>
            </div>
            
            {notification.status === 'unread' && (
              <button
                onClick={() => handleMarkAsRead(notification.Id)}
                className="flex-shrink-0 p-1 text-gray-400 hover:text-primary-600 transition-colors"
                title="Mark as read"
              >
                <ApperIcon name="Check" size={16} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationList;