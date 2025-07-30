import { toast } from 'react-toastify';

export const applicationService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "appliedAt" } },
          { field: { Name: "status" } },
          { field: { Name: "notes" } },
          { field: { Name: "interview" } },
          { field: { Name: "jobId" } },
          { field: { Name: "candidateId" } }
        ],
        orderBy: [
          { fieldName: "appliedAt", sorttype: "DESC" }
        ],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await apperClient.fetchRecords('application', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching applications:", error.response.data.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "appliedAt" } },
          { field: { Name: "status" } },
          { field: { Name: "notes" } },
          { field: { Name: "interview" } },
          { field: { Name: "jobId" } },
          { field: { Name: "candidateId" } }
        ]
      };

      const response = await apperClient.getRecordById('application', id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching application with ID ${id}:`, error.response.data.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(applicationData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields for creation
      const params = {
        records: [{
          Name: applicationData.Name || `Application ${Date.now()}`,
          appliedAt: applicationData.appliedAt || new Date().toISOString(),
          status: applicationData.status || 'applied',
          notes: applicationData.notes || '',
          interview: applicationData.interview || '',
          jobId: parseInt(applicationData.jobId),
          candidateId: parseInt(applicationData.candidateId)
        }]
      };

      const response = await apperClient.createRecord('application', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create application ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating application:", error.response.data.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(id, applicationData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields for update
      const updateFields = {};
      if (applicationData.Name !== undefined) updateFields.Name = applicationData.Name;
      if (applicationData.appliedAt !== undefined) updateFields.appliedAt = applicationData.appliedAt;
      if (applicationData.status !== undefined) updateFields.status = applicationData.status;
      if (applicationData.notes !== undefined) updateFields.notes = applicationData.notes;
      if (applicationData.interview !== undefined) updateFields.interview = applicationData.interview;
      if (applicationData.jobId !== undefined) updateFields.jobId = parseInt(applicationData.jobId);
      if (applicationData.candidateId !== undefined) updateFields.candidateId = parseInt(applicationData.candidateId);

      const params = {
        records: [{
          Id: parseInt(id),
          ...updateFields
        }]
      };

      const response = await apperClient.updateRecord('application', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update application ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating application:", error.response.data.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async updateStatus(applicationId, newStatus) {
    return await this.update(applicationId, { status: newStatus });
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('application', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete application ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting application:", error.response.data.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  },

  async getByJobId(jobId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "appliedAt" } },
          { field: { Name: "status" } },
          { field: { Name: "notes" } },
          { field: { Name: "interview" } },
          { field: { Name: "jobId" } },
          { field: { Name: "candidateId" } }
        ],
        where: [
          {
            FieldName: "jobId",
            Operator: "EqualTo",
            Values: [parseInt(jobId)]
          }
        ],
        orderBy: [
          { fieldName: "appliedAt", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords('application', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching applications by job ID:", error.message);
      return [];
    }
  },

  async getByCandidateId(candidateId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "appliedAt" } },
          { field: { Name: "status" } },
          { field: { Name: "notes" } },
          { field: { Name: "interview" } },
          { field: { Name: "jobId" } },
          { field: { Name: "candidateId" } }
        ],
        where: [
          {
            FieldName: "candidateId",
            Operator: "EqualTo",
            Values: [parseInt(candidateId)]
          }
        ],
        orderBy: [
          { fieldName: "appliedAt", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords('application', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching applications by candidate ID:", error.message);
      return [];
    }
  },

  async getUpcomingInterviews() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "appliedAt" } },
          { field: { Name: "status" } },
          { field: { Name: "notes" } },
          { field: { Name: "interview" } },
          { field: { Name: "jobId" } },
          { field: { Name: "candidateId" } }
        ],
        where: [
          {
            FieldName: "status",
            Operator: "EqualTo",
            Values: ["interview_scheduled"]
          }
        ],
        orderBy: [
          { fieldName: "appliedAt", sorttype: "ASC" }
        ]
      };

      const response = await apperClient.fetchRecords('application', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching upcoming interviews:", error.message);
      return [];
    }
  },

  async checkApplication(jobId, candidateId) {
    try {
      const applications = await this.getByJobId(jobId);
      return applications.find(app => app.candidateId === parseInt(candidateId)) || null;
    } catch (error) {
      console.error("Error checking application:", error.message);
      return null;
    }
  }
};