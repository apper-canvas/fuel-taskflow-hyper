import { toast } from 'react-toastify';

export const noteService = {
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
          { field: { Name: "entityType" } },
          { field: { Name: "entityId" } },
          { field: { Name: "category" } },
          { field: { Name: "content" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "updatedAt" } }
        ],
        orderBy: [
          { fieldName: "createdAt", sorttype: "DESC" }
        ],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await apperClient.fetchRecords('note', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching notes:", error.response.data.message);
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
          { field: { Name: "entityType" } },
          { field: { Name: "entityId" } },
          { field: { Name: "category" } },
          { field: { Name: "content" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "updatedAt" } }
        ]
      };

      const response = await apperClient.getRecordById('note', id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching note with ID ${id}:`, error.response.data.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async getByEntity(entityType, entityId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "entityType" } },
          { field: { Name: "entityId" } },
          { field: { Name: "category" } },
          { field: { Name: "content" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "updatedAt" } }
        ],
        whereGroups: [
          {
            operator: "AND",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "entityType",
                    operator: "EqualTo",
                    values: [entityType]
                  }
                ],
                operator: "AND"
              },
              {
                conditions: [
                  {
                    fieldName: "entityId",
                    operator: "EqualTo",
                    values: [parseInt(entityId)]
                  }
                ],
                operator: "AND"
              }
            ]
          }
        ],
        orderBy: [
          { fieldName: "createdAt", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords('note', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching notes by entity:", error.message);
      return [];
    }
  },

  async create(noteData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields for creation
      const params = {
        records: [{
          Name: noteData.Name || `Note ${Date.now()}`,
          entityType: noteData.entityType,
          entityId: parseInt(noteData.entityId),
          category: noteData.category,
          content: noteData.content?.trim(),
          createdAt: noteData.createdAt || new Date().toISOString(),
          updatedAt: noteData.updatedAt || new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord('note', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create note ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating note:", error.response.data.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(id, noteData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields for update
      const updateFields = {};
      if (noteData.Name !== undefined) updateFields.Name = noteData.Name;
      if (noteData.entityType !== undefined) updateFields.entityType = noteData.entityType;
      if (noteData.entityId !== undefined) updateFields.entityId = parseInt(noteData.entityId);
      if (noteData.category !== undefined) updateFields.category = noteData.category;
      if (noteData.content !== undefined) updateFields.content = noteData.content?.trim();
      if (noteData.createdAt !== undefined) updateFields.createdAt = noteData.createdAt;
      if (noteData.updatedAt !== undefined) updateFields.updatedAt = noteData.updatedAt;
      
      // Always update the updatedAt timestamp
      updateFields.updatedAt = new Date().toISOString();

      const params = {
        records: [{
          Id: parseInt(id),
          ...updateFields
        }]
      };

      const response = await apperClient.updateRecord('note', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update note ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating note:", error.response.data.message);
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

      const response = await apperClient.deleteRecord('note', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete note ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting note:", error.response.data.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  },

  // Helper method to check if note can be edited (within 24 hours)
  canEdit(note) {
    const noteTime = new Date(note.createdAt);
    const now = new Date();
    const hoursDiff = (now - noteTime) / (1000 * 60 * 60);
    return hoursDiff <= 24;
  }
};