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
          { field: { Name: "title_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "jobType_c" } },
          { field: { Name: "salaryMin_c" } },
          { field: { Name: "salaryMax_c" } },
          { field: { Name: "experienceLevel_c" } },
          { field: { Name: "requiredSkills_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "applicants_c" } },
          { field: { Name: "clientId_c" } }
        ]
      };

      const response = await apperClient.fetchRecords('job_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(job => ({
        Id: job.Id,
        title: job.title_c || '',
        company: job.company_c || '',
        clientId: job.clientId_c?.Id || job.clientId_c,
        location: job.location_c || '',
        jobType: job.jobType_c || '',
        salaryMin: job.salaryMin_c || 0,
        salaryMax: job.salaryMax_c || 0,
        experienceLevel: job.experienceLevel_c || '',
        requiredSkills: job.requiredSkills_c || '',
        description: job.description_c || '',
        status: job.status_c || 'active',
        createdAt: job.createdAt_c || new Date().toISOString(),
        applicants: job.applicants_c || 0
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching jobs:", error?.response?.data?.message);
      } else {
        console.error("Error fetching jobs:", error.message);
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
          { field: { Name: "title_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "jobType_c" } },
          { field: { Name: "salaryMin_c" } },
          { field: { Name: "salaryMax_c" } },
          { field: { Name: "experienceLevel_c" } },
          { field: { Name: "requiredSkills_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "applicants_c" } },
          { field: { Name: "clientId_c" } }
        ]
      };

      const response = await apperClient.getRecordById('job_c', parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (!response.data) {
        return null;
      }

      const job = response.data;
      return {
        Id: job.Id,
        title: job.title_c || '',
        company: job.company_c || '',
        clientId: job.clientId_c?.Id || job.clientId_c,
        location: job.location_c || '',
        jobType: job.jobType_c || '',
        salaryMin: job.salaryMin_c || 0,
        salaryMax: job.salaryMax_c || 0,
        experienceLevel: job.experienceLevel_c || '',
        requiredSkills: job.requiredSkills_c || '',
        description: job.description_c || '',
        status: job.status_c || 'active',
        createdAt: job.createdAt_c || new Date().toISOString(),
        applicants: job.applicants_c || 0
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching job with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching job with ID ${id}:`, error.message);
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

      const params = {
        records: [{
          Name: jobData.title || '',
          title_c: jobData.title || '',
          company_c: jobData.company || '',
          location_c: jobData.location || '',
          jobType_c: jobData.jobType || '',
          salaryMin_c: parseInt(jobData.salaryMin) || 0,
          salaryMax_c: parseInt(jobData.salaryMax) || 0,
          experienceLevel_c: jobData.experienceLevel || '',
          requiredSkills_c: jobData.requiredSkills || '',
          description_c: jobData.description || '',
          status_c: jobData.status || 'active',
          createdAt_c: new Date().toISOString(),
          applicants_c: 0,
          clientId_c: parseInt(jobData.clientId) || null
        }]
      };

      const response = await apperClient.createRecord('job_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
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

        if (successfulRecords.length > 0) {
          const newJob = successfulRecords[0].data;
          return {
            Id: newJob.Id,
            title: newJob.title_c || '',
            company: newJob.company_c || '',
            clientId: newJob.clientId_c?.Id || newJob.clientId_c,
            location: newJob.location_c || '',
            jobType: newJob.jobType_c || '',
            salaryMin: newJob.salaryMin_c || 0,
            salaryMax: newJob.salaryMax_c || 0,
            experienceLevel: newJob.experienceLevel_c || '',
            requiredSkills: newJob.requiredSkills_c || '',
            description: newJob.description_c || '',
            status: newJob.status_c || 'active',
            createdAt: newJob.createdAt_c || new Date().toISOString(),
            applicants: newJob.applicants_c || 0
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating job:", error?.response?.data?.message);
      } else {
        console.error("Error creating job:", error.message);
      }
      throw error;
    }
  },

  async update(id, updateData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          Name: updateData.title || '',
          title_c: updateData.title || '',
          company_c: updateData.company || '',
          location_c: updateData.location || '',
          jobType_c: updateData.jobType || '',
          salaryMin_c: parseInt(updateData.salaryMin) || 0,
          salaryMax_c: parseInt(updateData.salaryMax) || 0,
          experienceLevel_c: updateData.experienceLevel || '',
          requiredSkills_c: updateData.requiredSkills || '',
          description_c: updateData.description || '',
          status_c: updateData.status || 'active',
          applicants_c: updateData.applicants || 0,
          clientId_c: parseInt(updateData.clientId) || null
        }]
      };

      const response = await apperClient.updateRecord('job_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
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

        if (successfulUpdates.length > 0) {
          const updatedJob = successfulUpdates[0].data;
          return {
            Id: updatedJob.Id,
            title: updatedJob.title_c || '',
            company: updatedJob.company_c || '',
            clientId: updatedJob.clientId_c?.Id || updatedJob.clientId_c,
            location: updatedJob.location_c || '',
            jobType: updatedJob.jobType_c || '',
            salaryMin: updatedJob.salaryMin_c || 0,
            salaryMax: updatedJob.salaryMax_c || 0,
            experienceLevel: updatedJob.experienceLevel_c || '',
            requiredSkills: updatedJob.requiredSkills_c || '',
            description: updatedJob.description_c || '',
            status: updatedJob.status_c || 'active',
            createdAt: updatedJob.createdAt_c || new Date().toISOString(),
            applicants: updatedJob.applicants_c || 0
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating job:", error?.response?.data?.message);
      } else {
        console.error("Error updating job:", error.message);
      }
      throw error;
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

      const response = await apperClient.deleteRecord('job_c', params);

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
        console.error("Error deleting job:", error?.response?.data?.message);
      } else {
        console.error("Error deleting job:", error.message);
      }
      return false;
    }
  }
};