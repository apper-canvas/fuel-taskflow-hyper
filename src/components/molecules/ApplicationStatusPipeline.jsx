import React, { useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const ApplicationStatusPipeline = ({ 
  currentStatus, 
  onStatusChange, 
  applicationId, 
  showUpdateDropdown = false,
  onInterviewSchedule,
  className 
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const statusStages = [
    {
      key: 'applied',
      label: 'Applied',
      color: 'bg-blue-500',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50',
      icon: 'FileText'
    },
    {
      key: 'screening',
      label: 'Screening',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-700',
      bgColor: 'bg-yellow-50',
      icon: 'Search'
    },
    {
      key: 'interview_scheduled',
      label: 'Interview Scheduled',
      color: 'bg-purple-500',
      textColor: 'text-purple-700',
      bgColor: 'bg-purple-50',
      icon: 'Calendar'
    },
    {
      key: 'final_review',
      label: 'Final Review',
      color: 'bg-orange-500',
      textColor: 'text-orange-700',
      bgColor: 'bg-orange-50',
      icon: 'ClipboardCheck'
    },
    {
      key: 'hired',
      label: 'Hired',
      color: 'bg-green-500',
      textColor: 'text-green-700',
      bgColor: 'bg-green-50',
      icon: 'CheckCircle'
    },
    {
      key: 'rejected',
      label: 'Rejected',
      color: 'bg-red-500',
      textColor: 'text-red-700',
      bgColor: 'bg-red-50',
      icon: 'XCircle'
    }
  ];

const currentStageIndex = statusStages.findIndex(stage => stage.key === currentStatus);
  
const handleStatusUpdate = async (newStatus) => {
    // Validate that we have the required props and the status is actually changing
    if (!onStatusChange || !applicationId || !newStatus || newStatus === currentStatus) {
      return;
    }
    
    setIsUpdating(true);
    try {
      await onStatusChange(applicationId, newStatus);
      // Show success notification
      toast.success(`Application status updated to ${statusStages.find(s => s.key === newStatus)?.label || newStatus}`);
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error(error.message || 'Failed to update application status');
      // Reset the select value on error by triggering a re-render
      setTimeout(() => setIsUpdating(false), 100);
      return;
    }
    setIsUpdating(false);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Pipeline Visualization */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
        {statusStages.slice(0, 4).map((stage, index) => {
          const isActive = stage.key === currentStatus;
          const isPassed = currentStageIndex > index;
          const isRejected = currentStatus === 'rejected';
          
          return (
            <div key={stage.key} className="flex items-center flex-1 min-w-0">
              <div className="flex flex-col items-center text-center flex-1">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200",
                  isActive && !isRejected ? stage.color + " text-white" : 
                  isPassed && !isRejected ? stage.color + " text-white" :
                  isRejected ? "bg-gray-300 text-gray-500" :
                  "bg-gray-200 text-gray-400"
                )}>
                  <ApperIcon name={stage.icon} size={14} />
                </div>
                <span className={cn(
                  "text-xs font-medium mt-1 leading-tight",
                  isActive && !isRejected ? stage.textColor :
                  isPassed && !isRejected ? stage.textColor :
                  "text-gray-500"
                )}>
                  {stage.label}
                </span>
              </div>
              {index < 3 && (
                <div className={cn(
                  "h-0.5 flex-1 mx-2 transition-all duration-200",
                  isPassed && !isRejected ? stage.color : "bg-gray-200"
                )} />
              )}
            </div>
          );
        })}
      </div>

      {/* Final Status (Hired/Rejected) */}
      <div className="flex justify-center gap-4">
        {statusStages.slice(4).map((stage) => {
          const isActive = stage.key === currentStatus;
          
          return (
            <div key={stage.key} className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200",
              isActive ? stage.bgColor : "bg-gray-50"
            )}>
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center",
                isActive ? stage.color + " text-white" : "bg-gray-200 text-gray-400"
              )}>
                <ApperIcon name={stage.icon} size={12} />
              </div>
              <span className={cn(
                "text-sm font-medium",
                isActive ? stage.textColor : "text-gray-500"
              )}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
{/* Status Update Dropdown */}
{showUpdateDropdown && onStatusChange && applicationId && (
        <div className="pt-2 border-t">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Update Status
          </label>
          <select
            value={currentStatus}
            onChange={(e) => handleStatusUpdate(e.target.value)}
            disabled={isUpdating}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            {statusStages.map(stage => (
              <option key={stage.key} value={stage.key}>
                {stage.label}
              </option>
            ))}
          </select>
          
          {isUpdating && (
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-500 border-t-transparent"></div>
              Updating status...
            </div>
          )}
          
          {/* Interview Scheduling Trigger */}
          {currentStatus === 'interview_scheduled' && onInterviewSchedule && (
            <div className="mt-2">
              <button
                onClick={() => onInterviewSchedule(applicationId)}
                className="w-full px-3 py-2 text-sm bg-purple-50 text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors flex items-center justify-center gap-2"
              >
                <ApperIcon name="Calendar" size={16} />
                Schedule Interview Details
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default ApplicationStatusPipeline;