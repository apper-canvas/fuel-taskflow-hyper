import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Error = ({ 
  message = "Something went wrong. Please try again.", 
  onRetry,
  className 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-6 text-center", className)}>
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center mb-6 shadow-lg">
        <ApperIcon name="AlertTriangle" size={32} className="text-red-600" />
      </div>
      
      <h3 className="text-xl font-semibold font-display text-gray-900 mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {message}
      </p>
      
      {onRetry && (
        <Button 
          onClick={onRetry}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="RefreshCw" size={16} />
          <span>Try Again</span>
        </Button>
      )}
    </div>
  );
};

export default Error;