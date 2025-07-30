import React, { useContext } from 'react';
import { AuthContext } from '../../App';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
    >
      <ApperIcon name="LogOut" size={16} />
      Logout
    </Button>
  );
};

export default LogoutButton;