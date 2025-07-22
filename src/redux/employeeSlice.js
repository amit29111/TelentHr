// employeeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../api/apiService';

export const fetchEmployeeById = createAsyncThunk(
  'employee/fetchById',
  async (empId, { rejectWithValue }) => {
    try {
      const response = await apiService.getEmployeeById(empId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch employee');
    }
  }
);
export const fetchEmployeeNotification = createAsyncThunk(
  'employee/fetchNotification',
  async (empId, { rejectWithValue }) => {
    try {
      const response = await apiService.getEmployeeNotification(empId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch notification');
    }
  }
);

const employeeSlice = createSlice({
  name: 'employee',
  initialState: {
    employeeData: null,
    notificationData: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // For Employee By Id
    builder
      .addCase(fetchEmployeeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeData = action.payload;
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // For Employee Notification
    builder
      .addCase(fetchEmployeeNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.notificationData = action.payload;
      })
      .addCase(fetchEmployeeNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export default employeeSlice.reducer;
