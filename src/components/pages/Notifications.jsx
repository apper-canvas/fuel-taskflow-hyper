import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import NotificationList from '@/components/molecules/NotificationList';
import Loading from '@/components/ui/Loading';
import { 
  fetchNotifications, 
  fetchUnreadCount,
  markAllNotificationsAsRead,
  clearError 
} from '@/store/notificationSlice';

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications, loading, error, unreadCount } = useSelector(state => state.notifications);
  const { user } = useSelector(state => state.user);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    if (user?.userId) {
      loadNotifications();
      dispatch(fetchUnreadCount(user.userId));
    }
  }, [user?.userId, statusFilter, currentPage]);

  const loadNotifications = () => {
    if (user?.userId) {
      const filters = {
        recipient: user.userId,
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage
      };
      
      if (statusFilter !== 'all') {
        filters.status = statusFilter;
      }
      
      dispatch(fetchNotifications(filters));
    }
  };

  const handleMarkAllAsRead = async () => {
    if (user?.userId && unreadCount > 0) {
      try {
        await dispatch(markAllNotificationsAsRead(user.userId));
        dispatch(fetchUnreadCount(user.userId));
        loadNotifications();
      } catch (error) {
        console.error('Error marking all as read:', error);
      }
    }
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

const filteredNotifications = notifications.filter(notification =>
    notification.notificationContent_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (notification.relatedEntity_c && notification.relatedEntity_c.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleNotificationRead = (notificationId) => {
    if (user?.userId) {
      dispatch(fetchUnreadCount(user.userId));
    }
  };

  if (loading && notifications.length === 0) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">
            Stay updated with your latest activities and updates
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <Badge variant="default" className="px-3 py-1">
              {unreadCount} unread
            </Badge>
          )}
          
          {unreadCount > 0 && (
            <Button
              onClick={handleMarkAllAsRead}
              variant="outline"
              size="sm"
              className="whitespace-nowrap"
            >
              <ApperIcon name="CheckCheck" size={16} className="mr-2" />
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <ApperIcon 
                name="Search" 
                size={20} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              />
              <Input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* Status Filter */}
          <div className="flex gap-2">
            <Button
              onClick={() => handleStatusFilter('all')}
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              size="sm"
            >
              All
            </Button>
            <Button
              onClick={() => handleStatusFilter('unread')}
              variant={statusFilter === 'unread' ? 'default' : 'outline'}
              size="sm"
            >
              Unread
            </Button>
            <Button
              onClick={() => handleStatusFilter('read')}
              variant={statusFilter === 'read' ? 'default' : 'outline'}
              size="sm"
            >
              Read
            </Button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <ApperIcon name="AlertCircle" size={20} className="text-red-500" />
            <div>
              <p className="text-sm font-medium text-red-800">Error loading notifications</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
            <Button
              onClick={() => {
                dispatch(clearError());
                loadNotifications();
              }}
              variant="outline"
              size="sm"
              className="ml-auto"
            >
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <NotificationList 
        notifications={filteredNotifications}
        loading={loading}
        onMarkAsRead={handleNotificationRead}
      />

      {/* Pagination */}
      {filteredNotifications.length >= itemsPerPage && (
        <div className="flex justify-center space-x-2">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
          >
            <ApperIcon name="ChevronLeft" size={16} className="mr-1" />
            Previous
          </Button>
          
          <span className="flex items-center px-4 py-2 text-sm text-gray-600">
            Page {currentPage}
          </span>
          
          <Button
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={filteredNotifications.length < itemsPerPage}
            variant="outline"
            size="sm"
          >
            Next
            <ApperIcon name="ChevronRight" size={16} className="ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Notifications;