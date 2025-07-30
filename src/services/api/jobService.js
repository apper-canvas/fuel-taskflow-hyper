import { toast } from 'react-toastify';

export const jobService = {
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
          { field: { Name: "title" } },
          { field: { Name: "company" } },
          { field: { Name: "location" } },
          { field: { Name: "jobType" } },
          { field: { Name: "salaryMin" } },
          { field: { Name: "salaryMax" } },
          { field: { Name: "experienceLevel" } },
          { field: { Name: "requiredSkills" } },
          { field: { Name: "description" } },
          { field: { Name: "status" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "applicants" } },
          { field: { Name: "clientId" } }
        ],
        orderBy: [
          { fieldName: "createdAt", sorttype: "DESC" }
        ],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await apperClient.fetchRecords('job', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching jobs:", error.response.data.message);
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
          { field: { Name: "title" } },
          { field: { Name: "company" } },
          { field: { Name: "location" } },
          { field: { Name: "jobType" } },
          { field: { Name: "salaryMin" } },
          { field: { Name: "salaryMax" } },
          { field: { Name: "experienceLevel" } },
          { field: { Name: "requiredSkills" } },
          { field: { Name: "description" } },
          { field: { Name: "status" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "applicants" } },
          { field: { Name: "clientId" } }
        ]
      };

      const response = await apperClient.getRecordById('job', id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching job with ID ${id}:`, error.response.data.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(jobData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields for creation
      const params = {
        records: [{
          Name: jobData.Name || jobData.title || `Job ${Date.now()}`,
          title: jobData.title,
          company: jobData.company,
          location: jobData.location,
          jobType: jobData.jobType,
          salaryMin: jobData.salaryMin ? parseInt(jobData.salaryMin) : null,
          salaryMax: jobData.salaryMax ? parseInt(jobData.salaryMax) : null,
          experienceLevel: jobData.experienceLevel,
          requiredSkills: jobData.requiredSkills,
          description: jobData.description,
          status: jobData.status || 'active',
          createdAt: jobData.createdAt || new Date().toISOString(),
          applicants: jobData.applicants || 0,
          clientId: parseInt(jobData.clientId)
        }]
      };

      const response = await apperClient.createRecord('job', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create job ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating job:", error.response.data.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(id, jobData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields for update
      const updateFields = {};
      if (jobData.Name !== undefined) updateFields.Name = jobData.Name;
      if (jobData.title !== undefined) updateFields.title = jobData.title;
      if (jobData.company !== undefined) updateFields.company = jobData.company;
      if (jobData.location !== undefined) updateFields.location = jobData.location;
      if (jobData.jobType !== undefined) updateFields.jobType = jobData.jobType;
      if (jobData.salaryMin !== undefined) updateFields.salaryMin = jobData.salaryMin ? parseInt(jobData.salaryMin) : null;
      if (jobData.salaryMax !== undefined) updateFields.salaryMax = jobData.salaryMax ? parseInt(jobData.salaryMax) : null;
      if (jobData.experienceLevel !== undefined) updateFields.experienceLevel = jobData.experienceLevel;
      if (jobData.requiredSkills !== undefined) updateFields.requiredSkills = jobData.requiredSkills;
      if (jobData.description !== undefined) updateFields.description = jobData.description;
      if (jobData.status !== undefined) updateFields.status = jobData.status;
      if (jobData.createdAt !== undefined) updateFields.createdAt = jobData.createdAt;
      if (jobData.applicants !== undefined) updateFields.applicants = parseInt(jobData.applicants);
      if (jobData.clientId !== undefined) updateFields.clientId = parseInt(jobData.clientId);

      const params = {
        records: [{
          Id: parseInt(id),
          ...updateFields
        }]
      };

      const response = await apperClient.updateRecord('job', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update job ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating job:", error.response.data.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
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

      const response = await apperClient.deleteRecord('job', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete job ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting job:", error.response.data.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
};