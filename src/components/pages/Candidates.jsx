import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { applicationService } from "@/services/api/applicationService";
import { jobService } from "@/services/api/jobService";
import { candidateService } from "@/services/api/candidateService";
import ApperIcon from "@/components/ApperIcon";
import CandidateCard from "@/components/molecules/CandidateCard";
import SearchBar from "@/components/molecules/SearchBar";
import CandidateProfileModal from "@/components/organisms/CandidateProfileModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

function Candidates() {
const [candidates, setCandidates] = useState([])
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
const [modalMode, setModalMode] = useState('add')

  const statusOptions = [
    { value: 'all', label: 'All Candidates' },
    { value: 'new', label: 'New' },
    { value: 'interviewed', label: 'Interviewed' },
    { value: 'hired', label: 'Hired' },
    { value: 'rejected', label: 'Rejected' }
  ]

  useEffect(() => {
    loadCandidates()
  }, [])

  async function loadCandidates() {
    setLoading(true)
setError(null)
    
    try {
      const [candidatesData, jobsData, applicationsData] = await Promise.all([
        candidateService.getAll(),
        jobService.getAll(),
        applicationService.getAll()
      ])
      
      setCandidates(candidatesData)
      setJobs(jobsData)
      setApplications(applicationsData)
    } catch (err) {
      setError('Failed to load candidates. Please try again.')
      console.error('Failed to load candidates:', err)
    } finally {
      setLoading(false)
    }
}

function handleViewCandidate(candidate) {
    setSelectedCandidate(candidate)
    setModalMode('view')
    setIsModalOpen(true)
  }

  function handleEditCandidate(candidate) {
    setSelectedCandidate(candidate)
    setModalMode('edit')
    setIsModalOpen(true)
  }

  function handleContactCandidate(candidate) {
    // Simulate contact action
    toast.info(`Contacting ${candidate.name}...`)
    // In a real app, this might open email client or phone dialer
  }

  async function handleAddCandidate(candidateData) {
    try {
      const newCandidate = await candidateService.create(candidateData)
      setCandidates(prev => [newCandidate, ...prev])
      toast.success('Candidate added successfully!')
    } catch (error) {
      toast.error(error.message || 'Failed to add candidate')
      throw error
}
  }

  async function handleStatusChange(applicationId, newStatus) {
    try {
      await applicationService.updateStatus(applicationId, newStatus);
      
      // Reload applications to get updated data
      const updatedApplications = await applicationService.getAll();
      setApplications(updatedApplications);
      
      toast.success('Application status updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update application status');
      console.error('Failed to update application status:', error);
    }
  }

  // Helper function to determine candidate status from their applications
  function getCandidateStatus(candidateId) {
    const candidateApplications = applications.filter(app => app.candidateId === candidateId);
    
    if (candidateApplications.length === 0) return 'new';
    
    // Priority order for determining overall candidate status
    const statusPriority = ['hired', 'rejected', 'final_review', 'interview_scheduled', 'screening', 'applied'];
    
    for (const status of statusPriority) {
      if (candidateApplications.some(app => app.status === status)) {
        return status === 'applied' ? 'new' : 
               status === 'screening' ? 'interviewed' :
               status === 'interview_scheduled' ? 'interviewed' :
               status === 'final_review' ? 'interviewed' : status;
      }
    }
    
    return 'new';
  }

  async function handleApplicationUpdate(applicationId, updates) {
    try {
      await applicationService.update(applicationId, updates)
      
      // Reload applications to get updated data
      const updatedApplications = await applicationService.getAll()
      setApplications(updatedApplications)
      
      toast.success('Application updated successfully!')
    } catch (error) {
      toast.error(error.message || 'Failed to update application')
      console.error('Failed to update application:', error)
    }
  }

const getCandidateApplications = (candidateId) => {
    const candidateApplications = applications.filter(app => app.candidateId === candidateId)
    return candidateApplications.map(app => {
      const job = jobs.find(job => job.Id === app.jobId)
      return {
        ...app,
        jobTitle: job?.title || 'Unknown Position'
      }
    })
  }

  const getAppliedJobsForCandidate = (candidateId) => {
    const candidateApplications = applications.filter(app => app.candidateId === candidateId)
    return candidateApplications.map(app => 
      jobs.find(job => job.Id === app.jobId)
    ).filter(Boolean)
  }

function getStatusCounts() {
    const counts = {
      all: candidates.length,
      new: 0,
      interviewed: 0,
      hired: 0,
      rejected: 0
    }

    candidates.forEach(candidate => {
      const status = getCandidateStatus(candidate.Id);
      if (counts.hasOwnProperty(status)) {
        counts[status]++;
      }
    });

    return counts;
  }

  const statusCounts = getStatusCounts()
  
const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = !searchTerm || 
      candidate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const candidateStatus = getCandidateStatus(candidate.Id);
    const matchesStatus = statusFilter === 'all' || candidateStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  })
  return (
<div className="space-y-6">
{/* Header */}
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
<div>
<h1 className="text-2xl font-bold font-display text-gray-900">
Candidate Pool
</h1>
<p className="text-gray-600">
Review and manage job applicants
</p>
</div>

<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
{/* Add Candidate Button */}
<Button
onClick={() => setIsAddModalOpen(true)}
className="flex items-center gap-2"
>
<ApperIcon name="Plus" size={16} />
Add Candidate
</Button>

{/* Status Overview */}
<div className="flex items-center space-x-2">
<Badge variant="primary">
{statusCounts.new} New
</Badge>
<Badge variant="secondary">
{statusCounts.interviewed} Interviewed
</Badge>
<Badge variant="active">
{statusCounts.hired} Hired
</Badge>
</div>
</div>
</div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search candidates..."
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <ApperIcon name="Filter" size={16} className="text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex h-10 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

{/* Content */}
      {loading ? (
        <Loading />
      ) : error ? (
        <Error message={error} onRetry={loadCandidates} />
      ) : filteredCandidates.length === 0 ? (
        <Empty
          title="No candidates found"
          description={searchTerm || statusFilter !== "all" 
            ? "Try adjusting your search terms or filters." 
            : "No candidates have applied yet."
          }
        />
      ) : (
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCandidates.map(candidate => (
            <CandidateCard
              key={candidate.Id}
              candidate={candidate}
              onView={handleViewCandidate}
              onEdit={handleEditCandidate}
              onContact={handleContactCandidate}
              appliedJobs={getAppliedJobsForCandidate(candidate.Id)}
            />
          ))}
        </div>
      )}

{/* View/Edit Candidate Modal */}
      <CandidateProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={modalMode === 'edit' ? handleAddCandidate : undefined}
        candidate={selectedCandidate}
        mode={modalMode}
        candidateApplications={selectedCandidate ? getCandidateApplications(selectedCandidate.Id) : []}
        onApplicationUpdate={handleApplicationUpdate}
        onStatusChange={handleStatusChange}
      />

      {/* Add Candidate Modal */}
      <CandidateProfileModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddCandidate}
        mode="add"
      />
    </div>
  );
};

export default Candidates;