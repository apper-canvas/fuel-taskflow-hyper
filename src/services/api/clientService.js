import { toast } from 'react-toastify';

export const clientService = {
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
          { field: { Name: "companyName_c" } },
          { field: { Name: "contactPerson_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "relationshipStatus_c" } },
          { field: { Name: "createdAt_c" } }
        ]
      };

      const response = await apperClient.fetchRecords('client_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(client => ({
        Id: client.Id,
        companyName: client.companyName_c || '',
        contactPerson: client.contactPerson_c || '',
        email: client.email_c || '',
        phone: client.phone_c || '',
        address: client.address_c || '',
        relationshipStatus: client.relationshipStatus_c || 'active',
        createdAt: client.createdAt_c || new Date().toISOString()
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching clients:", error?.response?.data?.message);
      } else {
        console.error("Error fetching clients:", error.message);
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
          { field: { Name: "companyName_c" } },
          { field: { Name: "contactPerson_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "address_c" } },
          { field: { Name: "relationshipStatus_c" } },
          { field: { Name: "createdAt_c" } }
        ]
      };

      const response = await apperClient.getRecordById('client_c', parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (!response.data) {
        return null;
      }

      const client = response.data;
      return {
        Id: client.Id,
        companyName: client.companyName_c || '',
        contactPerson: client.contactPerson_c || '',
        email: client.email_c || '',
        phone: client.phone_c || '',
        address: client.address_c || '',
        relationshipStatus: client.relationshipStatus_c || 'active',
        createdAt: client.createdAt_c || new Date().toISOString()
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching client with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching client with ID ${id}:`, error.message);
      }
      return null;
    }
  },

  async create(clientData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: clientData.companyName || '',
          companyName_c: clientData.companyName || '',
          contactPerson_c: clientData.contactPerson || '',
          email_c: clientData.email || '',
          phone_c: clientData.phone || '',
          address_c: clientData.address || '',
          relationshipStatus_c: clientData.relationshipStatus || 'active',
          createdAt_c: new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord('client_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create client ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const newClient = successfulRecords[0].data;
          return {
            Id: newClient.Id,
            companyName: newClient.companyName_c || '',
            contactPerson: newClient.contactPerson_c || '',
            email: newClient.email_c || '',
            phone: newClient.phone_c || '',
            address: newClient.address_c || '',
            relationshipStatus: newClient.relationshipStatus_c || 'active',
            createdAt: newClient.createdAt_c || new Date().toISOString()
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating client:", error?.response?.data?.message);
      } else {
        console.error("Error creating client:", error.message);
      }
      throw error;
    }
  },

  async update(id, clientData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          Name: clientData.companyName || '',
          companyName_c: clientData.companyName || '',
          contactPerson_c: clientData.contactPerson || '',
          email_c: clientData.email || '',
          phone_c: clientData.phone || '',
          address_c: clientData.address || '',
          relationshipStatus_c: clientData.relationshipStatus || 'active'
        }]
      };

      const response = await apperClient.updateRecord('client_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update client ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const updatedClient = successfulUpdates[0].data;
          return {
            Id: updatedClient.Id,
            companyName: updatedClient.companyName_c || '',
            contactPerson: updatedClient.contactPerson_c || '',
            email: updatedClient.email_c || '',
            phone: updatedClient.phone_c || '',
            address: updatedClient.address_c || '',
            relationshipStatus: updatedClient.relationshipStatus_c || 'active',
            createdAt: updatedClient.createdAt_c || new Date().toISOString()
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating client:", error?.response?.data?.message);
      } else {
        console.error("Error updating client:", error.message);
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

      const response = await apperClient.deleteRecord('client_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete client ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting client:", error?.response?.data?.message);
      } else {
        console.error("Error deleting client:", error.message);
      }
      return false;
    }
  }
};