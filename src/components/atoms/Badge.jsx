import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ 
  className, 
  variant = "default", 
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    active: "bg-gradient-to-r from-green-100 to-green-200 text-green-800",
    inactive: "bg-gradient-to-r from-red-100 to-red-200 text-red-800",
    pending: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800",
    primary: "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800",
    secondary: "bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-800"
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;