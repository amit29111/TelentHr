import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ✅ API CALL
export const fetchEmployeeHighlights = createAsyncThunk(
  'highlights/fetchEmployeeHighlights',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        'https://hrmsbackend.nagarsoftwaresolution.com/employee/getEmployeeHighlights'
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error');
    }
  }
);

const highlightsSlice = createSlice({
  name: 'highlights',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: builder => {
    builder
      .addCase(fetchEmployeeHighlights.pending, state => {
        state.loading = true;
      })
      .addCase(fetchEmployeeHighlights.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data; // 👈 important
      })
      .addCase(fetchEmployeeHighlights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default highlightsSlice.reducer;