import { toast } from 'react-toastify';

export const candidateService = {
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
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "location" } },
          { field: { Name: "currentJobTitle" } },
          { field: { Name: "position" } },
          { field: { Name: "status" } },
          { field: { Name: "appliedAt" } },
          { field: { Name: "experienceLevel" } },
          { field: { Name: "skills" } },
          { field: { Name: "resumeSummary" } },
          { field: { Name: "availability" } }
        ],
        orderBy: [
          { fieldName: "appliedAt", sorttype: "DESC" }
        ],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await apperClient.fetchRecords('candidate', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching candidates:", error.response.data.message);
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
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "location" } },
          { field: { Name: "currentJobTitle" } },
          { field: { Name: "position" } },
          { field: { Name: "status" } },
          { field: { Name: "appliedAt" } },
          { field: { Name: "experienceLevel" } },
          { field: { Name: "skills" } },
          { field: { Name: "resumeSummary" } },
          { field: { Name: "availability" } }
        ]
      };

      const response = await apperClient.getRecordById('candidate', id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching candidate with ID ${id}:`, error.response.data.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(candidateData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Format skills array as tag field (comma-separated string)
      const skillsFormatted = Array.isArray(candidateData.skills) 
        ? candidateData.skills.join(',')
        : candidateData.skills || '';

      // Only include Updateable fields for creation
      const params = {
        records: [{
          Name: candidateData.Name || candidateData.name || `Candidate ${Date.now()}`,
          email: candidateData.email,
          phone: candidateData.phone,
          location: candidateData.location,
          currentJobTitle: candidateData.currentJobTitle,
          position: candidateData.position,
          status: candidateData.status || 'new',
          appliedAt: candidateData.appliedAt || new Date().toISOString(),
          experienceLevel: candidateData.experienceLevel || 'entry',
          skills: skillsFormatted,
          resumeSummary: candidateData.resumeSummary,
          availability: candidateData.availability || 'available'
        }]
      };

      const response = await apperClient.createRecord('candidate', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create candidate ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating candidate:", error.response.data.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(id, candidateData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields for update
      const updateFields = {};
      if (candidateData.Name !== undefined) updateFields.Name = candidateData.Name;
      if (candidateData.name !== undefined) updateFields.Name = candidateData.name; // Handle both formats
      if (candidateData.email !== undefined) updateFields.email = candidateData.email;
      if (candidateData.phone !== undefined) updateFields.phone = candidateData.phone;
      if (candidateData.location !== undefined) updateFields.location = candidateData.location;
      if (candidateData.currentJobTitle !== undefined) updateFields.currentJobTitle = candidateData.currentJobTitle;
      if (candidateData.position !== undefined) updateFields.position = candidateData.position;
      if (candidateData.status !== undefined) updateFields.status = candidateData.status;
      if (candidateData.appliedAt !== undefined) updateFields.appliedAt = candidateData.appliedAt;
      if (candidateData.experienceLevel !== undefined) updateFields.experienceLevel = candidateData.experienceLevel;
      if (candidateData.resumeSummary !== undefined) updateFields.resumeSummary = candidateData.resumeSummary;
      if (candidateData.availability !== undefined) updateFields.availability = candidateData.availability;
      
      // Handle skills field formatting
      if (candidateData.skills !== undefined) {
        updateFields.skills = Array.isArray(candidateData.skills) 
          ? candidateData.skills.join(',')
          : candidateData.skills;
      }

      const params = {
        records: [{
          Id: parseInt(id),
          ...updateFields
        }]
      };

      const response = await apperClient.updateRecord('candidate', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update candidate ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating candidate:", error.response.data.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

async delete(id) {
    try {
      // Validate ID parameter
      if (!id || id === null || id === undefined) {
        console.error("Error deleting candidate: Invalid ID provided");
        toast.error("Invalid candidate ID provided");
        return false;
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const parsedId = parseInt(id);
      if (isNaN(parsedId)) {
        console.error("Error deleting candidate: Invalid ID format");
        toast.error("Invalid candidate ID format");
        return false;
      }

      const params = {
        RecordIds: [parsedId]
      };
      const response = await apperClient.deleteRecord('candidate', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete candidate ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting candidate:", error.response.data.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
};