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
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "currentJobTitle_c" } },
          { field: { Name: "position_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "appliedAt_c" } },
          { field: { Name: "experienceLevel_c" } },
          { field: { Name: "skills_c" } },
          { field: { Name: "resumeSummary_c" } },
          { field: { Name: "availability_c" } }
        ]
      };

      const response = await apperClient.fetchRecords('candidate_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(candidate => ({
        Id: candidate.Id,
        name: candidate.Name || '',
        email: candidate.email_c || '',
        phone: candidate.phone_c || '',
        location: candidate.location_c || '',
        currentJobTitle: candidate.currentJobTitle_c || '',
        position: candidate.position_c || '',
        status: candidate.status_c || 'new',
        appliedAt: candidate.appliedAt_c || new Date().toISOString(),
        experienceLevel: candidate.experienceLevel_c || 'entry',
        skills: candidate.skills_c ? candidate.skills_c.split(',') : [],
        resumeSummary: candidate.resumeSummary_c || '',
        availability: candidate.availability_c || 'available'
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching candidates:", error?.response?.data?.message);
      } else {
        console.error("Error fetching candidates:", error.message);
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
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "currentJobTitle_c" } },
          { field: { Name: "position_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "appliedAt_c" } },
          { field: { Name: "experienceLevel_c" } },
          { field: { Name: "skills_c" } },
          { field: { Name: "resumeSummary_c" } },
          { field: { Name: "availability_c" } }
        ]
      };

      const response = await apperClient.getRecordById('candidate_c', parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (!response.data) {
        return null;
      }

      const candidate = response.data;
      return {
        Id: candidate.Id,
        name: candidate.Name || '',
        email: candidate.email_c || '',
        phone: candidate.phone_c || '',
        location: candidate.location_c || '',
        currentJobTitle: candidate.currentJobTitle_c || '',
        position: candidate.position_c || '',
        status: candidate.status_c || 'new',
        appliedAt: candidate.appliedAt_c || new Date().toISOString(),
        experienceLevel: candidate.experienceLevel_c || 'entry',
        skills: candidate.skills_c ? candidate.skills_c.split(',') : [],
        resumeSummary: candidate.resumeSummary_c || '',
        availability: candidate.availability_c || 'available'
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching candidate with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching candidate with ID ${id}:`, error.message);
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

      const params = {
        records: [{
          Name: candidateData.name || '',
          email_c: candidateData.email || '',
          phone_c: candidateData.phone || '',
          location_c: candidateData.location || '',
          currentJobTitle_c: candidateData.currentJobTitle || '',
          position_c: candidateData.position || '',
          status_c: candidateData.status || 'new',
          appliedAt_c: new Date().toISOString(),
          experienceLevel_c: candidateData.experienceLevel || 'entry',
          skills_c: Array.isArray(candidateData.skills) ? candidateData.skills.join(',') : candidateData.skills || '',
          resumeSummary_c: candidateData.resumeSummary || '',
          availability_c: candidateData.availability || 'available'
        }]
      };

      const response = await apperClient.createRecord('candidate_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
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

        if (successfulRecords.length > 0) {
          const newCandidate = successfulRecords[0].data;
          return {
            Id: newCandidate.Id,
            name: newCandidate.Name || '',
            email: newCandidate.email_c || '',
            phone: newCandidate.phone_c || '',
            location: newCandidate.location_c || '',
            currentJobTitle: newCandidate.currentJobTitle_c || '',
            position: newCandidate.position_c || '',
            status: newCandidate.status_c || 'new',
            appliedAt: newCandidate.appliedAt_c || new Date().toISOString(),
            experienceLevel: newCandidate.experienceLevel_c || 'entry',
            skills: newCandidate.skills_c ? newCandidate.skills_c.split(',') : [],
            resumeSummary: newCandidate.resumeSummary_c || '',
            availability: newCandidate.availability_c || 'available'
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating candidate:", error?.response?.data?.message);
      } else {
        console.error("Error creating candidate:", error.message);
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
          Name: updateData.name || '',
          email_c: updateData.email || '',
          phone_c: updateData.phone || '',
          location_c: updateData.location || '',
          currentJobTitle_c: updateData.currentJobTitle || '',
          position_c: updateData.position || '',
          status_c: updateData.status || 'new',
          experienceLevel_c: updateData.experienceLevel || 'entry',
          skills_c: Array.isArray(updateData.skills) ? updateData.skills.join(',') : updateData.skills || '',
          resumeSummary_c: updateData.resumeSummary || '',
          availability_c: updateData.availability || 'available'
        }]
      };

      const response = await apperClient.updateRecord('candidate_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
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

        if (successfulUpdates.length > 0) {
          const updatedCandidate = successfulUpdates[0].data;
          return {
            Id: updatedCandidate.Id,
            name: updatedCandidate.Name || '',
            email: updatedCandidate.email_c || '',
            phone: updatedCandidate.phone_c || '',
            location: updatedCandidate.location_c || '',
            currentJobTitle: updatedCandidate.currentJobTitle_c || '',
            position: updatedCandidate.position_c || '',
            status: updatedCandidate.status_c || 'new',
            appliedAt: updatedCandidate.appliedAt_c || new Date().toISOString(),
            experienceLevel: updatedCandidate.experienceLevel_c || 'entry',
            skills: updatedCandidate.skills_c ? updatedCandidate.skills_c.split(',') : [],
            resumeSummary: updatedCandidate.resumeSummary_c || '',
            availability: updatedCandidate.availability_c || 'available'
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating candidate:", error?.response?.data?.message);
      } else {
        console.error("Error updating candidate:", error.message);
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

      const response = await apperClient.deleteRecord('candidate_c', params);

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
        console.error("Error deleting candidate:", error?.response?.data?.message);
      } else {
        console.error("Error deleting candidate:", error.message);
      }
      return false;
    }
  }
};