import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ApperIcon from "@/components/ApperIcon";
import NotificationDropdown from "@/components/organisms/NotificationDropdown";
import { useLocation } from "react-router-dom";
import { fetchUnreadCount, setDropdownOpen } from "@/store/notificationSlice";
const Header = ({ onMobileMenuToggle }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  
  const { unreadCount } = useSelector(state => state.notifications);
  const { user } = useSelector(state => state.user);

  useEffect(() => {
    if (user?.userId) {
      dispatch(fetchUnreadCount(user.userId));
      
      // Set up periodic refresh of unread count
      const interval = setInterval(() => {
        dispatch(fetchUnreadCount(user.userId));
      }, 30000); // Refresh every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [user?.userId, dispatch]);

  const handleNotificationClick = () => {
    setNotificationDropdownOpen(!notificationDropdownOpen);
  };

  const handleCloseNotificationDropdown = () => {
    setNotificationDropdownOpen(false);
  };
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Dashboard";
      case "/jobs":
        return "Jobs";
      case "/candidates":
        return "Candidates";
      default:
        return "Dashboard";
    }
  };

return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="Menu" size={24} />
          </button>
          
          <div className="hidden lg:block">
            <h1 className="text-2xl font-bold font-display bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {getPageTitle()}
            </h1>
          </div>
          
          <div className="lg:hidden">
            <h1 className="text-xl font-bold font-display bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              TalentBridge
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button 
              onClick={handleNotificationClick}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ApperIcon name="Bell" size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
            
            <NotificationDropdown 
              isOpen={notificationDropdownOpen}
              onClose={handleCloseNotificationDropdown}
            />
          </div>
          
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <ApperIcon name="Settings" size={20} />
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg">
            <ApperIcon name="User" size={16} className="text-white" />
          </div>
        </div>
      </div>
    </header>
);
};

export default Header;