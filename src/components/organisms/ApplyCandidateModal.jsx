import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import CandidateCard from '@/components/molecules/CandidateCard';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import { candidateService } from '@/services/api/candidateService';
import { applicationService } from '@/services/api/applicationService';
import { toast } from 'react-toastify';

const ApplyCandidateModal = ({ 
  isOpen, 
  onClose, 
  job = null, 
  onApplicationCreated 
}) => {
  const [candidates, setCandidates] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'new', label: 'New' },
    { value: 'interviewed', label: 'Interviewed' },
    { value: 'hired', label: 'Hired' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const availabilityOptions = [
    { value: 'all', label: 'All Availability' },
    { value: 'available', label: 'Available' },
    { value: 'busy', label: 'Busy' },
    { value: 'unavailable', label: 'Unavailable' }
  ];

  useEffect(() => {
    if (isOpen && job) {
      loadData();
    }
  }, [isOpen, job]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [candidatesData, applicationsData] = await Promise.all([
        candidateService.getAll(),
        applicationService.getByJobId(job.Id)
      ]);
      
      setCandidates(candidatesData);
      setApplications(applicationsData);
    } catch (error) {
      toast.error('Failed to load candidates');
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCandidate = async (candidate) => {
    // Check if already applied
    const existingApplication = applications.find(app => app.candidateId === candidate.Id);
    if (existingApplication) {
      toast.warning('This candidate has already been applied to this job');
      return;
    }

    setApplying(true);
    try {
      const newApplication = await applicationService.create({
        jobId: job.Id,
        candidateId: candidate.Id,
        notes: ''
      });

      setApplications(prev => [...prev, newApplication]);
      toast.success(`${candidate.name} has been applied to ${job.title}`);
      
      if (onApplicationCreated) {
        onApplicationCreated(newApplication);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to apply candidate');
    } finally {
      setApplying(false);
    }
  };

  const isAlreadyApplied = (candidateId) => {
    return applications.some(app => app.candidateId === candidateId);
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = !searchTerm || 
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = selectedStatus === 'all' || candidate.status === selectedStatus;
    const matchesAvailability = selectedAvailability === 'all' || candidate.availability === selectedAvailability;

    return matchesSearch && matchesStatus && matchesAvailability;
  });

  const availableCandidates = filteredCandidates.filter(candidate => !isAlreadyApplied(candidate.Id));
  const appliedCandidates = filteredCandidates.filter(candidate => isAlreadyApplied(candidate.Id));

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
          className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold font-display text-gray-900">
                Apply Candidates
              </h2>
              <p className="text-gray-600 mt-1">
                Select candidates to apply for "{job?.title}"
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ApperIcon name="X" size={24} />
            </button>
          </div>

          {/* Filters */}
          <div className="p-6 border-b bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Search candidates by name, position, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <select
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {availabilityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
            {loading ? (
              <div className="p-12">
                <Loading />
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {/* Available Candidates */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-semibold font-display text-gray-900">
                      Available Candidates
                    </h3>
                    <Badge variant="secondary">
                      {availableCandidates.length}
                    </Badge>
                  </div>
                  
                  {availableCandidates.length === 0 ? (
                    <Empty 
                      title="No available candidates"
                      description="All matching candidates have already been applied to this job or no candidates match your filters."
                    />
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {availableCandidates.map(candidate => (
                        <div key={candidate.Id} className="relative">
                          <CandidateCard 
                            candidate={candidate}
                            className="h-full"
                          />
                          <div className="absolute top-4 right-4">
                            <Button
                              size="sm"
                              onClick={() => handleApplyCandidate(candidate)}
                              disabled={applying}
                              className="flex items-center gap-2"
                            >
                              {applying && <ApperIcon name="Loader2" size={14} className="animate-spin" />}
                              Apply
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Already Applied Candidates */}
                {appliedCandidates.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <h3 className="text-lg font-semibold font-display text-gray-900">
                        Already Applied
                      </h3>
                      <Badge variant="outline">
                        {appliedCandidates.length}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {appliedCandidates.map(candidate => (
                        <div key={candidate.Id} className="relative opacity-75">
                          <CandidateCard 
                            candidate={candidate}
                            className="h-full"
                          />
                          <div className="absolute top-4 right-4">
                            <Badge variant="active">
                              Applied
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t bg-gray-50">
            <div className="text-sm text-gray-600">
              {applications.length} candidates applied to this job
            </div>
            <Button
              variant="ghost"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ApplyCandidateModal;