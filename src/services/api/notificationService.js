import { toast } from 'react-toastify';

export const notificationService = {
  async getAll(filters = {}) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "notificationContent_c" } },
          { field: { Name: "recipient_c" } },
          { field: { Name: "timestamp_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "relatedEntity_c" } },
          { field: { Name: "CreatedOn" } }
        ],
        orderBy: [
          {
            fieldName: "timestamp_c",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: filters.limit || 20,
          offset: filters.offset || 0
        }
      };

      // Add status filter if provided
      if (filters.status) {
        params.where = [
          {
            FieldName: "status_c",
            Operator: "EqualTo",
            Values: [filters.status]
          }
        ];
      }

      // Add recipient filter if provided
      if (filters.recipient) {
        const whereCondition = {
          FieldName: "recipient_c",
          Operator: "EqualTo",
          Values: [filters.recipient.toString()]
        };
        
        if (params.where) {
          params.where.push(whereCondition);
        } else {
          params.where = [whereCondition];
        }
      }

      const response = await apperClient.fetchRecords('notification_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(notification => ({
        Id: notification.Id,
        content: notification.notificationContent_c || '',
        recipient: notification.recipient_c || null,
        timestamp: notification.timestamp_c || notification.CreatedOn,
        status: notification.status_c || 'unread',
        relatedEntity: notification.relatedEntity_c || '',
        createdOn: notification.CreatedOn
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching notifications:", error?.response?.data?.message);
      } else {
        console.error("Error fetching notifications:", error.message);
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
          { field: { Name: "notificationContent_c" } },
          { field: { Name: "recipient_c" } },
          { field: { Name: "timestamp_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "relatedEntity_c" } },
          { field: { Name: "CreatedOn" } }
        ]
      };

      const response = await apperClient.getRecordById('notification_c', parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (!response.data) {
        return null;
      }

      const notification = response.data;
      return {
        Id: notification.Id,
        content: notification.notificationContent_c || '',
        recipient: notification.recipient_c || null,
        timestamp: notification.timestamp_c || notification.CreatedOn,
        status: notification.status_c || 'unread',
        relatedEntity: notification.relatedEntity_c || '',
        createdOn: notification.CreatedOn
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching notification with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching notification with ID ${id}:`, error.message);
      }
      return null;
    }
  },

  async create(notificationData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: `Notification-${Date.now()}`,
          notificationContent_c: notificationData.content,
          recipient_c: parseInt(notificationData.recipient),
          timestamp_c: new Date().toISOString(),
          status_c: 'unread',
          relatedEntity_c: notificationData.relatedEntity || ''
        }]
      };

      const response = await apperClient.createRecord('notification_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create notification ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const newNotification = successfulRecords[0].data;
          return {
            Id: newNotification.Id,
            content: newNotification.notificationContent_c || '',
            recipient: newNotification.recipient_c || null,
            timestamp: newNotification.timestamp_c || newNotification.CreatedOn,
            status: newNotification.status_c || 'unread',
            relatedEntity: newNotification.relatedEntity_c || '',
            createdOn: newNotification.CreatedOn
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating notification:", error?.response?.data?.message);
      } else {
        console.error("Error creating notification:", error.message);
      }
      throw error;
    }
  },

  async markAsRead(notificationId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(notificationId),
          status_c: 'read'
        }]
      };

      const response = await apperClient.updateRecord('notification_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to mark notification as read ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          return true;
        }
      }
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error marking notification as read:", error?.response?.data?.message);
      } else {
        console.error("Error marking notification as read:", error.message);
      }
      throw error;
    }
  },

  async markAllAsRead(recipientId) {
    try {
      // First get all unread notifications for the recipient
      const unreadNotifications = await this.getAll({ 
        status: 'unread', 
        recipient: recipientId,
        limit: 100 
      });

      if (unreadNotifications.length === 0) {
        return true;
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: unreadNotifications.map(notification => ({
          Id: notification.Id,
          status_c: 'read'
        }))
      };

      const response = await apperClient.updateRecord('notification_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to mark notifications as read ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        return successfulUpdates.length > 0;
      }
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error marking all notifications as read:", error?.response?.data?.message);
      } else {
        console.error("Error marking all notifications as read:", error.message);
      }
      throw error;
    }
  },

  async getUnreadCount(recipientId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

const params = {
        fields: [
          { field: { Name: "Id" } }
        ],
        where: [
          {
            FieldName: "status_c",
            Operator: "EqualTo",
            Values: ["unread"]
          },
          {
            FieldName: "recipient_c",
            Operator: "EqualTo",
            Values: [parseInt(recipientId)]
          }
        ],
        pagingInfo: {
          limit: 1000,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords('notification_c', params);

      if (!response.success) {
        console.error(response.message);
        return 0;
      }

      return response.total || 0;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching unread count:", error?.response?.data?.message);
      } else {
        console.error("Error fetching unread count:", error.message);
      }
      return 0;
    }
  }
};