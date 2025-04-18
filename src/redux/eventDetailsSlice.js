import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { axiosWithAuth } from "../config/axios"
import { updateLocalEvent } from "./eventsSlice"

// Async thunk for fetching event details
export const fetchEventDetails = createAsyncThunk(
  "eventDetails/fetchEventDetails",
  async (eventId, { rejectWithValue }) => {
    try {
      // Use axiosWithAuth instead of createAxiosInstance
      const response = await axiosWithAuth.get(`/api/v1/foundation_events/${eventId}`)
      return response.data
    } catch (error) {
      // Improved error handling
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to fetch event details. Please check your connection."
      return rejectWithValue(errorMessage)
    }
  },
)

// Async thunk for updating event details
export const updateEventDetails = createAsyncThunk(
  "eventDetails/updateEventDetails",
  async ({ eventId, eventData }, { dispatch, rejectWithValue }) => {
    try {
      // Use axiosWithAuth instead of createAxiosInstance
      const response = await axiosWithAuth.put(`/api/v1/foundation_events/${eventId}`, { event: eventData })

      // Update the event in the events list as well
      dispatch(updateLocalEvent(response.data))

      return response.data
    } catch (error) {
      // Improved error handling
      const errorMessage =
        error.response?.data?.message || error.response?.data?.error || "Failed to update event. Please try again."
      return rejectWithValue(errorMessage)
    }
  },
)

// Async thunk for updating event evaluation
export const updateEventEvaluation = createAsyncThunk(
  "eventDetails/updateEventEvaluation",
  async ({ eventId, evaluation }, { dispatch, getState, rejectWithValue }) => {
    try {
      // Use axiosWithAuth instead of createAxiosInstance
      const response = await axiosWithAuth.put(`/api/v1/foundation_events/${eventId}/evaluation`, { evaluation })
      
      // Get the current event details and update with the new evaluation
      const currentEvent = getState().eventDetails.event
      const updatedEvent = { ...currentEvent, evaluation }

      // Update the event in the events list as well
      dispatch(updateLocalEvent(updatedEvent))

      return updatedEvent
    } catch (error) {
      // Improved error handling
      const errorMessage =
        error.response?.data?.message || error.response?.data?.error || "Failed to update evaluation. Please try again."
      return rejectWithValue(errorMessage)
    }
  },
)

// Initial state
const initialState = {
  event: null,
  loading: false,
  error: null,
  isEditMode: false,
}

const eventDetailsSlice = createSlice({
  name: "eventDetails",
  initialState,
  reducers: {
    setEditMode: (state, action) => {
      state.isEditMode = action.payload
    },
    // For optimistic updates
    updateEventLocally: (state, action) => {
      state.event = { ...state.event, ...action.payload }
    },
    resetEventDetails: (state) => {
      state.event = null
      state.loading = false
      state.error = null
      state.isEditMode = false
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch event details
      .addCase(fetchEventDetails.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEventDetails.fulfilled, (state, action) => {
        state.loading = false
        state.event = action.payload
      })
      .addCase(fetchEventDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update event details
      .addCase(updateEventDetails.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateEventDetails.fulfilled, (state, action) => {
        state.loading = false
        state.event = action.payload
        state.isEditMode = false
      })
      .addCase(updateEventDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update event evaluation
      .addCase(updateEventEvaluation.fulfilled, (state, action) => {
        state.event = action.payload
      })
  },
})

export const { setEditMode, updateEventLocally, resetEventDetails } = eventDetailsSlice.actions

export default eventDetailsSlice.reducer
