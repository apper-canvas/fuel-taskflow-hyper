import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { applicationService } from "@/services/api/applicationService";
import ApperIcon from "@/components/ApperIcon";
import ApplicationStatusPipeline from "@/components/molecules/ApplicationStatusPipeline";
import NotesList from "@/components/molecules/NotesList";
import FormField from "@/components/molecules/FormField";
import InterviewSchedulingModal from "@/components/organisms/InterviewSchedulingModal";
import Textarea from "@/components/atoms/Textarea";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
const CandidateProfileModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete,
  candidate = null, 
  mode = "add", // "add", "view", or "edit"
  candidateApplications = [],
  onApplicationUpdate,
  onStatusChange
}) => {
const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    currentJobTitle: "",
    experienceLevel: "entry",
    skills: [],
    resumeSummary: "",
    availability: "available",
    position: ""
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const experienceLevels = [
    { value: "entry", label: "Entry Level (0-2 years)" },
    { value: "mid", label: "Mid Level (3-5 years)" },
    { value: "senior", label: "Senior Level (6-10 years)" },
    { value: "lead", label: "Lead Level (10+ years)" }
  ];

  const availabilityOptions = [
    { value: "available", label: "Available", color: "text-green-600 bg-green-50" },
    { value: "busy", label: "Busy", color: "text-yellow-600 bg-yellow-50" },
    { value: "unavailable", label: "Unavailable", color: "text-red-600 bg-red-50" }
  ];

  useEffect(() => {
if (candidate && (mode === "view" || mode === "edit")) {
      setFormData({
        name: candidate.name || "",
        email: candidate.email || "",
        phone: candidate.phone || "",
        location: candidate.location || "",
        currentJobTitle: candidate.currentJobTitle || candidate.position || "",
        experienceLevel: candidate.experienceLevel || "entry",
        skills: candidate.skills || [],
        resumeSummary: candidate.resumeSummary || "",
        availability: candidate.availability || "available",
        position: candidate.position || ""
      });
    } else if (mode === "add") {
      // Reset form for new candidate
      setFormData({
        name: "",
        email: "",
        phone: "",
        location: "",
        currentJobTitle: "",
        experienceLevel: "entry",
        skills: [],
        resumeSummary: "",
        availability: "available",
        position: ""
      });
    }
    setErrors({});
  }, [candidate, mode, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }
    
    if (!formData.currentJobTitle.trim()) {
      newErrors.currentJobTitle = "Current job title is required";
    }

    if (!formData.position.trim()) {
      newErrors.position = "Position applying for is required";
    }
    
    if (formData.skills.length === 0) {
      newErrors.skills = "At least one skill is required";
    }
    
    if (!formData.resumeSummary.trim()) {
      newErrors.resumeSummary = "Resume summary is required";
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
      const candidateData = {
        ...formData,
        status: mode === "add" ? "new" : (candidate?.status || "new")
      };
      
      await onSave(candidateData);
      toast.success(mode === "add" ? "Candidate added successfully!" : "Candidate updated successfully!");
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to save candidate");
    } finally {
      setIsSubmitting(false);
    }
};

  const [isDeleting, setIsDeleting] = useState(false);

  const handleInterviewSchedule = (applicationId) => {
    setSelectedApplicationId(applicationId);
    setShowInterviewModal(true);
  };

  const handleScheduleInterview = async (interviewData) => {
    try {
      await applicationService.scheduleInterview(selectedApplicationId, interviewData);
      toast.success("Interview scheduled successfully!");
      setShowInterviewModal(false);
      setSelectedApplicationId(null);
      
      // Refresh application data if onApplicationUpdate is provided
      if (onApplicationUpdate) {
        const updatedApplication = await applicationService.getById(selectedApplicationId);
        onApplicationUpdate(selectedApplicationId, updatedApplication);
      }
    } catch (error) {
      toast.error(error.message || "Failed to schedule interview");
    }
  };
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill("");
      
      // Clear skills error if it exists
      if (errors.skills) {
        setErrors(prev => ({
          ...prev,
          skills: ""
        }));
      }
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const getAvailabilityDisplay = (availability) => {
    const option = availabilityOptions.find(opt => opt.value === availability);
    return option || availabilityOptions[0];
  };

  if (!isOpen) return null;

return (
    <>
    <AnimatePresence>
    <motion.div
        initial={{
            opacity: 0
        }}
        animate={{
            opacity: 1
        }}
        exit={{
            opacity: 0
        }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={onClose}>
        <motion.div
            initial={{
                scale: 0.95,
                opacity: 0
            }}
            animate={{
                scale: 1,
                opacity: 1
            }}
            exit={{
                scale: 0.95,
                opacity: 0
            }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b">
                <div>
                    <h2 className="text-2xl font-bold font-display text-gray-900">
{mode === "add" ? "Add New Candidate" : mode === "edit" ? "Edit Candidate" : "Candidate Profile"}
                    </h2>
                    <p className="text-gray-600 mt-1">
                        {mode === "add" ? "Create a detailed candidate profile" : mode === "edit" ? "Update candidate information" : "View and manage candidate information"}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ApperIcon name="X" size={24} />
</button>
            </div>
<form id="candidate-form" onSubmit={handleSubmit}>
              <div className="overflow-y-auto max-h-[calc(90vh-280px)] p-6 space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold font-display text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Full Name" required error={errors.name}>
                      <Input
                        value={formData.name}
                        onChange={e => handleInputChange("name", e.target.value)}
                        placeholder="Enter full name"
                        error={errors.name}
                        disabled={mode === "view"} />
                    </FormField>
                    <FormField label="Email" required error={errors.email}>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={e => handleInputChange("email", e.target.value)}
                        placeholder="Enter email address"
                        error={errors.email}
                        disabled={mode === "view"} />
                    </FormField>
                    <FormField label="Phone" required error={errors.phone}>
                      <Input
                        value={formData.phone}
                        onChange={e => handleInputChange("phone", e.target.value)}
                        placeholder="Enter phone number"
                        error={errors.phone}
                        disabled={mode === "view"} />
                    </FormField>
                    <FormField label="Location" required error={errors.location}>
                      <Input
                        value={formData.location}
                        onChange={e => handleInputChange("location", e.target.value)}
                        placeholder="City, State/Country"
                        error={errors.location}
                        disabled={mode === "view"} />
                    </FormField>
                  </div>
                </div>
                
                {/* Professional Information */}
                <div>
                  <h3 className="text-lg font-semibold font-display text-gray-900 mb-4">Professional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Current Job Title" required error={errors.currentJobTitle}>
                      <Input
                        value={formData.currentJobTitle}
                        onChange={e => handleInputChange("currentJobTitle", e.target.value)}
                        placeholder="Current position"
                        error={errors.currentJobTitle}
                        disabled={mode === "view"} />
                    </FormField>
                    <FormField label="Position Applying For" required error={errors.position}>
                      <Input
                        value={formData.position}
                        onChange={e => handleInputChange("position", e.target.value)}
                        placeholder="Desired position"
                        error={errors.position}
                        disabled={mode === "view"} />
                    </FormField>
                    <FormField label="Experience Level" required>
                      <select
                        value={formData.experienceLevel}
                        onChange={e => handleInputChange("experienceLevel", e.target.value)}
                        className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={mode === "view"}>
                        {experienceLevels.map(level => <option key={level.value} value={level.value}>
                          {level.label}
                        </option>)}
                      </select>
                    </FormField>
                    <FormField label="Availability Status" required>
                      <select
                        value={formData.availability}
                        onChange={e => handleInputChange("availability", e.target.value)}
                        className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={mode === "view"}>
                        {availabilityOptions.map(option => <option key={option.value} value={option.value}>
                          {option.label}
                        </option>)}
                      </select>
                    </FormField>
                  </div>
                </div>
                
                {/* Skills */}
                <div>
                  <h3 className="text-lg font-semibold font-display text-gray-900 mb-4">Skills & Expertise</h3>
                  <FormField label="Skills" required error={errors.skills}>
                    {(mode === "add" || mode === "edit") && <div className="flex gap-2 mb-3">
                      <Input
                        value={newSkill}
                        onChange={e => setNewSkill(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Add a skill and press Enter"
                        className="flex-1" />
                      <Button type="button" onClick={handleAddSkill} variant="outline" size="default">
                        <ApperIcon name="Plus" size={16} />
                      </Button>
                    </div>}
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map(
                        (skill, index) => <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {skill}
                          {(mode === "add" || mode === "edit") && <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-1 hover:text-red-500">
                            <ApperIcon name="X" size={12} />
                          </button>}
                        </Badge>
                      )}
                      {formData.skills.length === 0 && <p className="text-sm text-gray-500">No skills added yet</p>}
                    </div>
                  </FormField>
                </div>
                
                {/* Resume Summary */}
                <div>
                  <h3 className="text-lg font-semibold font-display text-gray-900 mb-4">Professional Summary</h3>
                  <FormField label="Resume Summary" required error={errors.resumeSummary}>
                    <Textarea
                      value={formData.resumeSummary}
                      onChange={e => handleInputChange("resumeSummary", e.target.value)}
                      placeholder="Brief summary of professional background, key achievements, and career objectives..."
                      rows={4}
                      error={errors.resumeSummary}
                      disabled={mode === "view"} />
                  </FormField>
                </div>

                {/* Communication Notes */}
                {candidate && candidate.Id && (
                  <div className="border-t border-gray-200 pt-6">
                    <NotesList
                      entityType="candidate"
                      entityId={candidate.Id}
                      entityName={candidate.name}
                    />
</div>
                )}
              </div>
            </form>

            {/* Application Status Management */}
            {(mode === "view" || mode === "edit") && candidate && (
              <div className="px-6 pb-6">
                <h3 className="text-lg font-semibold font-display text-gray-900 mb-4">Application Status</h3>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Current Status:</span>
                    <Badge
                      variant={candidate.status === "new" ? "primary" : candidate.status === "interviewed" ? "secondary" : candidate.status === "hired" ? "active" : "inactive"}>
                      {candidate.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Availability:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityDisplay(formData.availability).color}`}>
                      {getAvailabilityDisplay(formData.availability).label}
                    </span>
                  </div>
                </div>
                {/* Application Status Management */}
                {candidateApplications && candidateApplications.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-base font-medium text-gray-900">Applications</h4>
                    {candidateApplications.map(
                      application => (
                        <div key={application.Id} className="border border-gray-200 rounded-lg p-4">
                          <ApplicationStatusPipeline
                            currentStatus={application.status}
                            onStatusChange={onStatusChange}
                            applicationId={application.Id}
                            showUpdateDropdown={true}
                            onInterviewSchedule={handleInterviewSchedule} />
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Applied to:</span> {application.jobTitle || "Unknown Position"}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">Applied on {new Date(application.appliedAt).toLocaleDateString()}</p>
                            {application.interview && (
                              <div className="mt-2 p-2 bg-purple-50 rounded-lg">
                                <p className="text-sm font-medium text-purple-800">Interview Scheduled</p>
                                <p className="text-sm text-purple-600">
                                  {new Date(application.interview.date).toLocaleDateString()} at {application.interview.time}
                                </p>
                                <p className="text-sm text-purple-600">
                                  {application.interview.type} with {application.interview.interviewer}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t bg-gray-50">
              <div>
                {(mode === "view" || mode === "edit") && candidate && onDelete && (
                  <Button 
                    type="button" 
                    variant="ghost" 
onClick={async () => {
                      // Validate candidate and ID before deletion
                      if (!candidate || !candidate.Id) {
                        toast.error('Invalid candidate data - cannot delete');
                        return;
                      }

                      if (confirm('Are you sure you want to delete this candidate? This action cannot be undone.')) {
                        setIsDeleting(true);
                        try {
                          // Pass the raw ID - the service handles parsing and validation
                          await onDelete(candidate.Id);
                          toast.success('Candidate deleted successfully!');
                          onClose();
                        } catch (error) {
                          console.error('Delete error:', error);
                          toast.error(error.message || 'Failed to delete candidate');
                        } finally {
                          setIsDeleting(false);
                        }
                      }
                    }}
                    disabled={isDeleting || isSubmitting}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    {isDeleting && <ApperIcon name="Loader2" size={16} className="animate-spin" />}
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Button type="button" variant="ghost" onClick={onClose}>
                  {mode === "view" ? "Close" : "Cancel"}
                </Button>
                {(mode === "add" || mode === "edit") && (
                  <Button
                    variant="primary"
                    type="submit"
                    form="candidate-form"
                    disabled={isSubmitting || isDeleting}
                    className="flex items-center gap-2">
                    {isSubmitting && <ApperIcon name="Loader2" size={16} className="animate-spin" />}
                    {isSubmitting ? (mode === "add" ? "Adding..." : "Updating...") : (mode === "add" ? "Add Candidate" : "Update Candidate")}
                  </Button>
                )}
              </div>
            </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
    {/* Interview Scheduling Modal */}
    <AnimatePresence>
      {showInterviewModal && (
        <InterviewSchedulingModal
          isOpen={showInterviewModal}
          onClose={() => {
            setShowInterviewModal(false);
            setSelectedApplicationId(null);
          }}
          onSchedule={handleScheduleInterview}
          applicationId={selectedApplicationId}
        />
      )}
    </AnimatePresence>
    </>
  );
};

export default CandidateProfileModal;