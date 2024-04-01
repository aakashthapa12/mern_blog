import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'; // Importing the reducer directly

export const store = configureStore({
  reducer: {
    user: userReducer, // Using the imported reducer
  },
});