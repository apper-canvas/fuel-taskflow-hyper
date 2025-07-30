import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const MetricCard = ({ 
  title, 
  value, 
  icon, 
  change, 
  changeType = "neutral",
  className 
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case "positive":
        return "text-green-600";
      case "negative":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <Card className={cn("hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold font-display bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {value}
            </p>
            {change !== undefined && (
              <p className={cn("text-xs mt-2 flex items-center", getChangeColor())}>
                <ApperIcon 
                  name={changeType === "positive" ? "TrendingUp" : changeType === "negative" ? "TrendingDown" : "Minus"} 
                  size={14} 
                  className="mr-1" 
                />
                {Math.abs(change)}% from last month
              </p>
            )}
          </div>
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg">
            <ApperIcon name={icon} size={24} className="text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;