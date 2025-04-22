import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { axiosWithAuth } from "../config/axios"

// Async thunk for fetching quick registrations for a specific event
export const fetchEventQuickRegistrations = createAsyncThunk(
  "quickRegistrations/fetchEventQuickRegistrations",
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await axiosWithAuth.get(`/api/v1/event_quick_registrations?event_id=${eventId}`)
      return { data: response.data, eventId }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to fetch quick registrations. Please check your connection."
      return rejectWithValue(errorMessage)
    }
  },
)

// Initial state
const initialState = {
  quickRegistrations: [],
  loading: false,
  error: null,
  totalCount: 0,
  currentEventId: null,
}

const quickRegistrationsSlice = createSlice({
  name: "quickRegistrations",
  initialState,
  reducers: {
    clearQuickRegistrations: (state) => {
      state.quickRegistrations = []
      state.totalCount = 0
      state.currentEventId = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventQuickRegistrations.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEventQuickRegistrations.fulfilled, (state, action) => {
        state.loading = false

        // Handle case when payload is null or undefined
        if (action.payload.data === null || action.payload.data === undefined) {
          state.quickRegistrations = []
          state.totalCount = 0
        } else {
          state.quickRegistrations = action.payload.data
          state.totalCount = action.payload.data.length
        }

        state.currentEventId = action.payload.eventId // Store the current event ID
      })
      .addCase(fetchEventQuickRegistrations.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearQuickRegistrations } = quickRegistrationsSlice.actions

export default quickRegistrationsSlice.reducer