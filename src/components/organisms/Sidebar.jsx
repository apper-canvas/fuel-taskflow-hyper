import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose }) => {
const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Jobs", href: "/jobs", icon: "Briefcase" },
    { name: "Candidates", href: "/candidates", icon: "Users" },
    { name: "Clients", href: "/clients", icon: "Building2" },
  ];

  const SidebarContent = () => (
    <>
      <div className="flex items-center px-6 py-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <ApperIcon name="Zap" size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display text-white">
              TalentBridge
            </h1>
            <p className="text-xs text-white/70">Recruitment Platform</p>
          </div>
        </div>
      </div>

      <nav className="mt-6 px-3">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
                    isActive
                      ? "bg-white/20 text-white border-l-4 border-white shadow-lg backdrop-blur-sm"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  )
                }
              >
                <ApperIcon 
                  name={item.icon} 
                  size={20} 
                  className="mr-3 flex-shrink-0" 
                />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto px-6 py-6 border-t border-white/10">
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <ApperIcon name="User" size={16} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Admin User</p>
            <p className="text-xs text-white/70 truncate">admin@talentbridge.com</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 shadow-2xl">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <div
          className={cn(
            "fixed left-0 top-0 bottom-0 w-64 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 shadow-2xl transform transition-transform duration-300 ease-in-out",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <ApperIcon name="Zap" size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold font-display text-white">
                    TalentBridge
                  </h1>
                  <p className="text-xs text-white/70">Recruitment Platform</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>
            
            <nav className="mt-6 px-3 flex-1">
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.href}
                      onClick={onClose}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
                          isActive
                            ? "bg-white/20 text-white border-l-4 border-white shadow-lg backdrop-blur-sm"
                            : "text-white/70 hover:text-white hover:bg-white/10"
                        )
                      }
                    >
                      <ApperIcon 
                        name={item.icon} 
                        size={20} 
                        className="mr-3 flex-shrink-0" 
                      />
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="px-6 py-6 border-t border-white/10">
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <ApperIcon name="User" size={16} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">Admin User</p>
                  <p className="text-xs text-white/70 truncate">admin@talentbridge.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;