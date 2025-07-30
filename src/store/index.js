import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './notificationSlice'
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});