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
          { field: { Name: "entityType_c" } },
          { field: { Name: "entityId_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "updatedAt_c" } }
        ],
        orderBy: [
          {
            fieldName: "createdAt_c",
            sorttype: "DESC"
          }
        ]
      };

      const response = await apperClient.fetchRecords('note_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(note => ({
        Id: note.Id,
        entityType: note.entityType_c || '',
        entityId: note.entityId_c || 0,
        category: note.category_c || '',
        content: note.content_c || '',
        createdAt: note.createdAt_c || new Date().toISOString(),
        updatedAt: note.updatedAt_c || new Date().toISOString(),
        createdBy: "Current User"
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching notes:", error?.response?.data?.message);
      } else {
        console.error("Error fetching notes:", error.message);
      }
      return [];
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
          { field: { Name: "entityType_c" } },
          { field: { Name: "entityId_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "createdAt_c" } },
          { field: { Name: "updatedAt_c" } }
        ],
        where: [
          {
            FieldName: "entityType_c",
            Operator: "EqualTo",
            Values: [entityType]
          },
          {
            FieldName: "entityId_c",
            Operator: "EqualTo",
            Values: [parseInt(entityId)]
          }
        ],
        orderBy: [
          {
            fieldName: "createdAt_c",
            sorttype: "DESC"
          }
        ]
      };

      const response = await apperClient.fetchRecords('note_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(note => ({
        Id: note.Id,
        entityType: note.entityType_c || '',
        entityId: note.entityId_c || 0,
        category: note.category_c || '',
        content: note.content_c || '',
        createdAt: note.createdAt_c || new Date().toISOString(),
        updatedAt: note.updatedAt_c || new Date().toISOString(),
        createdBy: "Current User"
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching notes by entity:", error?.response?.data?.message);
      } else {
        console.error("Error fetching notes by entity:", error.message);
      }
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

      const now = new Date().toISOString();
      const params = {
        records: [{
          Name: `Note-${Date.now()}`,
          entityType_c: noteData.entityType || '',
          entityId_c: parseInt(noteData.entityId) || 0,
          category_c: noteData.category || '',
          content_c: noteData.content?.trim() || '',
          createdAt_c: now,
          updatedAt_c: now
        }]
      };

      const response = await apperClient.createRecord('note_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
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

        if (successfulRecords.length > 0) {
          const newNote = successfulRecords[0].data;
          return {
            Id: newNote.Id,
            entityType: newNote.entityType_c || '',
            entityId: newNote.entityId_c || 0,
            category: newNote.category_c || '',
            content: newNote.content_c || '',
            createdAt: newNote.createdAt_c || now,
            updatedAt: newNote.updatedAt_c || now,
            createdBy: "Current User"
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating note:", error?.response?.data?.message);
      } else {
        console.error("Error creating note:", error.message);
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

      const response = await apperClient.deleteRecord('note_c', params);

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
        console.error("Error deleting note:", error?.response?.data?.message);
      } else {
        console.error("Error deleting note:", error.message);
      }
return false;
    }
  },

  canEdit(note) {
    if (!note || !note.createdAt) {
      return false;
    }
    
    // Notes can only be edited within 24 hours of creation
    const createdAt = new Date(note.createdAt);
    const now = new Date();
    const timeDiff = now.getTime() - createdAt.getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    return timeDiff <= twentyFourHours;
  }
};