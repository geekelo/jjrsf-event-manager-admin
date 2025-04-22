import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosWithAuth } from '../config/axios'

const API_BASE = '/api/v1/event_feedbacks'

// Fetch feedbacks for a specific event
export const fetchFeedbacks = createAsyncThunk(
  'feedback/fetchFeedbacks',
  async (eventId, { rejectWithValue }) => {
    try {
      const res = await axiosWithAuth.get(`${API_BASE}?foundation_event_id=${eventId}`)
      return res.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch feedbacks')
    }
  }
)


// Update feedback
export const updateFeedback = createAsyncThunk(
  'feedback/updateFeedback',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axiosWithAuth.patch(`${API_BASE}/${id}`, data)
      return res.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update feedback')
    }
  }
)

export const createFeedback = createAsyncThunk(
  'feedback/createFeedback',
  async ({ eventId, review, testimony, name }, { rejectWithValue }) => {
    try {
      const payload = {
        event_id: eventId,
        event_feedback: {
          review: review,
          testimony: testimony,
          name: name,
        },
      };

      // Make the API request with axiosWithAuth (assuming it's a POST request)
      const res = await axiosWithAuth.post(`${API_BASE}?foundation_event_id=${eventId}`, payload);

      // Return the response data from the API
      return res.data;
    } catch (error) {
      // Handle error and provide a reject value
      return rejectWithValue(error.response?.data?.message || 'Failed to submit feedback');
    }
  }
);

// Slice
const feedbackSlice = createSlice({
  name: 'feedback',
  initialState: {
    allFeedbacks: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetFeedbackState: (state) => {
      state.allFeedbacks = []
      state.error = null
      state.loading = false
    },
   
  },
  extraReducers: (builder) => {
    builder
      // Fetch feedbacks
      .addCase(fetchFeedbacks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchFeedbacks.fulfilled, (state, action) => {
        state.loading = false
        state.allFeedbacks = action.payload
      })
      .addCase(fetchFeedbacks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Create feedback
      .addCase(createFeedback.pending, (state) => {
        state.loading = true;
      })
      .addCase(createFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.allFeedbacks.push(action.payload); 
      })
      .addCase(createFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update feedback
      .addCase(updateFeedback.fulfilled, (state, action) => {
        const index = state.allFeedbacks.findIndex(fb => fb.id === action.payload.id)
        if (index !== -1) {
          state.allFeedbacks[index] = action.payload
        }
      })
  },
})

export const { resetFeedbackState} = feedbackSlice.actions
export default feedbackSlice.reducer

