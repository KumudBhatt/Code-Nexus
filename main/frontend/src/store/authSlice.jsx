// src/store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token') || '',
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload); // Persist token in localStorage
    },
    clearToken: (state) => {
      state.token = '';
      localStorage.removeItem('token');
    },
  },
});

export const { setToken, clearToken } = authSlice.actions;

export default authSlice.reducer;
