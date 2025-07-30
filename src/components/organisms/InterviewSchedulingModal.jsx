import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const InterviewSchedulingModal = ({ 
  isOpen, 
  onClose, 
  onSchedule, 
  application = null,
  mode = "schedule" // "schedule" or "edit"
}) => {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    interviewer: "",
    type: "Video",
    notes: ""
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const interviewTypes = [
    { value: "Phone", label: "Phone Interview" },
    { value: "Video", label: "Video Interview" },
    { value: "In-person", label: "In-person Interview" }
  ];

  useEffect(() => {
    if (application && application.interview && mode === "edit") {
      setFormData({
        date: application.interview.date || "",
        time: application.interview.time || "",
        interviewer: application.interview.interviewer || "",
        type: application.interview.type || "Video",
        notes: application.interview.notes || ""
      });
    } else {
      // Reset form for new interview
      setFormData({
        date: "",
        time: "",
        interviewer: "",
        type: "Video",
        notes: ""
      });
    }
    setErrors({});
  }, [application, mode, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.date.trim()) {
      newErrors.date = "Interview date is required";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = "Interview date cannot be in the past";
      }
    }

    if (!formData.time.trim()) {
      newErrors.time = "Interview time is required";
    }

    if (!formData.interviewer.trim()) {
      newErrors.interviewer = "Interviewer name is required";
    }

    if (!formData.type) {
      newErrors.type = "Interview type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSchedule(formData);
      toast.success(mode === "schedule" ? "Interview scheduled successfully!" : "Interview updated successfully!");
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to schedule interview");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold font-display text-gray-900">
              {mode === "schedule" ? "Schedule Interview" : "Edit Interview"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Interview Date" required error={errors.date}>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  error={errors.date}
                  min={new Date().toISOString().split('T')[0]}
                />
              </FormField>

              <FormField label="Interview Time" required error={errors.time}>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange("time", e.target.value)}
                  error={errors.time}
                />
              </FormField>
            </div>

            <FormField label="Interviewer Name" required error={errors.interviewer}>
              <Input
                value={formData.interviewer}
                onChange={(e) => handleInputChange("interviewer", e.target.value)}
                placeholder="Enter interviewer's name"
                error={errors.interviewer}
              />
            </FormField>

            <FormField label="Interview Type" required error={errors.type}>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
                className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              >
                {interviewTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Notes" error={errors.notes}>
              <Textarea
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Additional notes about the interview..."
                rows={3}
              />
            </FormField>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
                    {mode === "schedule" ? "Scheduling..." : "Updating..."}
                  </>
                ) : (
                  mode === "schedule" ? "Schedule Interview" : "Update Interview"
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InterviewSchedulingModal;