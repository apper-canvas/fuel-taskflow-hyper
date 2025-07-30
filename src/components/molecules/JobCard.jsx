import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";
import { cn } from "@/utils/cn";

const JobCard = ({ job, className, onEdit, onDelete, onApplyCandidate, appliedCandidates = [] }) => {
  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "active";
      case "closed":
        return "inactive";
      case "draft":
        return "pending";
      default:
        return "default";
    }
  };

  return (
<Card className={cn("hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold font-display text-gray-900 mb-1">
              {job.title}
            </h3>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <span className="font-medium">{job.company}</span>
              {job.location && (
                <>
                  <span className="mx-2">•</span>
                  <div className="flex items-center">
                    <ApperIcon name="MapPin" size={14} className="mr-1" />
                    {job.location}
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant={getStatusVariant(job.status)}>
                {job.status}
              </Badge>
              {job.jobType && (
                <Badge variant="secondary">
                  {job.jobType}
                </Badge>
              )}
              {job.experienceLevel && (
                <Badge variant="outline">
                  {job.experienceLevel}
                </Badge>
              )}
            </div>
</div>
          <div className="flex items-center space-x-2">
            {job.status === 'active' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onApplyCandidate?.(job)}
                className="flex items-center gap-2"
              >
                <ApperIcon name="UserPlus" size={14} />
                Apply Candidate
              </Button>
            )}
            <button
              onClick={() => onEdit?.(job)}
              className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <ApperIcon name="Edit2" size={16} />
            </button>
            <button
              onClick={() => onDelete?.(job)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <ApperIcon name="Trash2" size={16} />
            </button>
          </div>
        </div>
        
        {(job.salaryMin || job.salaryMax) && (
          <div className="flex items-center mb-3 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">
            <ApperIcon name="DollarSign" size={14} className="mr-1" />
            {job.salaryMin && job.salaryMax 
              ? `$${parseInt(job.salaryMin).toLocaleString()} - $${parseInt(job.salaryMax).toLocaleString()}`
              : job.salaryMin 
                ? `From $${parseInt(job.salaryMin).toLocaleString()}`
                : `Up to $${parseInt(job.salaryMax).toLocaleString()}`
            }
          </div>
        )}
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {job.description}
        </p>
        
        {job.requiredSkills && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {job.requiredSkills.split(',').slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md"
                >
                  {skill.trim()}
                </span>
              ))}
              {job.requiredSkills.split(',').length > 3 && (
                <span className="text-xs text-gray-500 px-2 py-1">
                  +{job.requiredSkills.split(',').length - 3} more
                </span>
              )}
            </div>
          </div>
)}
        
        {/* Applied Candidates Section */}
        {appliedCandidates.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <ApperIcon name="Users" size={14} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                {appliedCandidates.length} Applied Candidates
              </span>
            </div>
            <div className="text-xs text-blue-700 line-clamp-2">
              {appliedCandidates.slice(0, 3).map(candidate => candidate.name).join(', ')}
              {appliedCandidates.length > 3 && ` and ${appliedCandidates.length - 3} more`}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <ApperIcon name="Calendar" size={14} className="mr-1" />
            Posted {format(new Date(job.createdAt), "MMM d, yyyy")}
          </div>
          <div className="flex items-center">
            <ApperIcon name="Users" size={14} className="mr-1" />
            {appliedCandidates.length} applied candidates
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;