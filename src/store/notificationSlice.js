import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { notificationService } from '@/services/api/notificationService';

// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (filters = {}) => {
    const notifications = await notificationService.getAll(filters);
    return notifications;
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async (recipientId) => {
    const count = await notificationService.getUnreadCount(recipientId);
    return count;
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId) => {
    await notificationService.markAsRead(notificationId);
    return notificationId;
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (recipientId) => {
    await notificationService.markAllAsRead(recipientId);
    return recipientId;
  }
);

export const createNotification = createAsyncThunk(
  'notifications/create',
  async (notificationData) => {
    const notification = await notificationService.create(notificationData);
    return notification;
  }
);

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  dropdownOpen: false
};

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setDropdownOpen: (state, action) => {
      state.dropdownOpen = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      if (action.payload.status === 'unread') {
        state.unreadCount += 1;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch unread count
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      // Mark as read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notificationId = action.payload;
const notification = state.notifications.find(n => n.Id === notificationId);
        if (notification && notification.status_c === 'unread') {
          notification.status_c = 'read';
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      // Mark all as read
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach(notification => {
          if (notification.status_c === 'unread') {
            notification.status_c = 'read';
          }
        });
        state.unreadCount = 0;
      })
      // Create notification
      .addCase(createNotification.fulfilled, (state, action) => {
        state.notifications.unshift(action.payload);
        if (action.payload.status === 'unread') {
          state.unreadCount += 1;
        }
      });
  }
});

export const { setDropdownOpen, clearError, addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;