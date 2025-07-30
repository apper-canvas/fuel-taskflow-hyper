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
          { field: { Name: "appliedAt_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "interview_c" } },
          { field: { Name: "jobId_c" } },
          { field: { Name: "candidateId_c" } }
        ]
      };

      const response = await apperClient.fetchRecords('application_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(application => ({
        Id: application.Id,
        jobId: application.jobId_c?.Id || application.jobId_c,
        candidateId: application.candidateId_c?.Id || application.candidateId_c,
        appliedAt: application.appliedAt_c || new Date().toISOString(),
        status: application.status_c || 'applied',
        notes: application.notes_c || '',
        interview: application.interview_c || null
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching applications:", error?.response?.data?.message);
      } else {
        console.error("Error fetching applications:", error.message);
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
          { field: { Name: "appliedAt_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "interview_c" } },
          { field: { Name: "jobId_c" } },
          { field: { Name: "candidateId_c" } }
        ]
      };

      const response = await apperClient.getRecordById('application_c', parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (!response.data) {
        return null;
      }

      const application = response.data;
      return {
        Id: application.Id,
        jobId: application.jobId_c?.Id || application.jobId_c,
        candidateId: application.candidateId_c?.Id || application.candidateId_c,
        appliedAt: application.appliedAt_c || new Date().toISOString(),
        status: application.status_c || 'applied',
        notes: application.notes_c || '',
        interview: application.interview_c || null
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching application with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching application with ID ${id}:`, error.message);
      }
      return null;
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
          { field: { Name: "appliedAt_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "interview_c" } },
          { field: { Name: "jobId_c" } },
          { field: { Name: "candidateId_c" } }
        ],
        where: [
          {
            FieldName: "jobId_c",
            Operator: "EqualTo",
            Values: [jobId.toString()]
          }
        ]
      };

      const response = await apperClient.fetchRecords('application_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(application => ({
        Id: application.Id,
        jobId: application.jobId_c?.Id || application.jobId_c,
        candidateId: application.candidateId_c?.Id || application.candidateId_c,
        appliedAt: application.appliedAt_c || new Date().toISOString(),
        status: application.status_c || 'applied',
        notes: application.notes_c || '',
        interview: application.interview_c || null
      }));
} catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching applications for job ${jobId}:`, error?.response?.data?.message);
        toast.error(`Failed to load applications: ${error.response.data.message}`);
      } else {
        console.error(`Error fetching applications for job ${jobId}:`, error.message);
        toast.error('Failed to load applications. Please check your connection.');
      }
      // Return empty array to prevent component crashes
      return [];
      return [];
    }
  },

  async create(applicationData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: `Application-${Date.now()}`,
          jobId_c: parseInt(applicationData.jobId),
          candidateId_c: parseInt(applicationData.candidateId),
          appliedAt_c: new Date().toISOString(),
          status_c: applicationData.status || 'applied',
          notes_c: applicationData.notes || '',
          interview_c: applicationData.interview || null
        }]
      };

      const response = await apperClient.createRecord('application_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
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

        if (successfulRecords.length > 0) {
          const newApplication = successfulRecords[0].data;
          return {
            Id: newApplication.Id,
            jobId: newApplication.jobId_c?.Id || newApplication.jobId_c,
            candidateId: newApplication.candidateId_c?.Id || newApplication.candidateId_c,
            appliedAt: newApplication.appliedAt_c || new Date().toISOString(),
            status: newApplication.status_c || 'applied',
            notes: newApplication.notes_c || '',
            interview: newApplication.interview_c || null
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating application:", error?.response?.data?.message);
      } else {
        console.error("Error creating application:", error.message);
      }
      throw error;
    }
  },

  async updateStatus(applicationId, newStatus) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(applicationId),
          status_c: newStatus
        }]
      };

      const response = await apperClient.updateRecord('application_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update application status ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const updatedApplication = successfulUpdates[0].data;
          return {
            Id: updatedApplication.Id,
            jobId: updatedApplication.jobId_c?.Id || updatedApplication.jobId_c,
            candidateId: updatedApplication.candidateId_c?.Id || updatedApplication.candidateId_c,
            appliedAt: updatedApplication.appliedAt_c || new Date().toISOString(),
            status: updatedApplication.status_c || 'applied',
            notes: updatedApplication.notes_c || '',
            interview: updatedApplication.interview_c || null
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating application status:", error?.response?.data?.message);
      } else {
        console.error("Error updating application status:", error.message);
      }
      throw error;
    }
  },

  async update(id, applicationData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          status_c: applicationData.status,
          notes_c: applicationData.notes,
          interview_c: applicationData.interview
        }]
      };

      const response = await apperClient.updateRecord('application_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
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

        if (successfulUpdates.length > 0) {
          const updatedApplication = successfulUpdates[0].data;
          return {
            Id: updatedApplication.Id,
            jobId: updatedApplication.jobId_c?.Id || updatedApplication.jobId_c,
            candidateId: updatedApplication.candidateId_c?.Id || updatedApplication.candidateId_c,
            appliedAt: updatedApplication.appliedAt_c || new Date().toISOString(),
            status: updatedApplication.status_c || 'applied',
            notes: updatedApplication.notes_c || '',
            interview: updatedApplication.interview_c || null
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating application:", error?.response?.data?.message);
      } else {
        console.error("Error updating application:", error.message);
      }
      throw error;
    }
  },

  async getUpcomingInterviews() {
    try {
      const applications = await this.getAll();
      const now = new Date();
      
      const upcomingInterviews = applications
        .filter(app => app.interview && app.status === 'interview_scheduled')
        .map(app => ({
          ...app,
          interviewDateTime: new Date(`${app.interview.date}T${app.interview.time}`)
        }))
        .filter(app => app.interviewDateTime >= now)
        .sort((a, b) => a.interviewDateTime - b.interviewDateTime);

      return upcomingInterviews.map(app => {
        const { interviewDateTime, ...rest } = app;
        return rest;
      });
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching upcoming interviews:", error?.response?.data?.message);
      } else {
        console.error("Error fetching upcoming interviews:", error.message);
      }
      return [];
    }
  }
};