// employeeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../api/apiService';

// Async Thunks
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

export const fetchByOrg = createAsyncThunk(
  'organization/fetchByOrg',
  async (orgId, { rejectWithValue }) => {
    try {
      const response = await apiService.organization(orgId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch organization');
    }
  }
);

// Employee Slice
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
      })
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

// Organization Slice
const organizationSlice = createSlice({
  name: 'organization',
  initialState: {
    employeeData: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchByOrg.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchByOrg.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeData = action.payload;
      })
      .addCase(fetchByOrg.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ✅ Named exports
export const employeeReducer = employeeSlice.reducer;
export const organizationReducer = organizationSlice.reducer;

