import React from "react";
import { cn } from "@/utils/cn";

const Loading = ({ className, variant = "default" }) => {
  const variants = {
    default: "space-y-6",
    grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
    list: "space-y-4"
  };

  const SkeletonCard = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-2"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-2/3 mb-3"></div>
            <div className="h-6 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full w-20"></div>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-primary-200 to-secondary-200 rounded-xl"></div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-5/6"></div>
        </div>
        <div className="flex items-center justify-between">
          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
        </div>
      </div>
    </div>
  );

  const SkeletonMetric = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-2 w-24"></div>
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-2 w-16"></div>
            <div className="h-3 bg-gradient-to-r from-green-100 to-green-200 rounded w-32"></div>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-primary-200 to-secondary-200 rounded-xl"></div>
        </div>
      </div>
    </div>
  );

  if (variant === "grid") {
    return (
      <div className={cn(variants.grid, className)}>
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (variant === "metrics") {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", className)}>
        {[...Array(4)].map((_, i) => (
          <SkeletonMetric key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className={cn(variants[variant], className)}>
      {[...Array(3)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export default Loading;