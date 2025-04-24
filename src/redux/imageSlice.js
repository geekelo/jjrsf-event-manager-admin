import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { axiosWithAuth } from "../config/axios"
import { fetchEvents } from "./eventsSlice"

// Async thunk for updating event image
export const updateEventImage = createAsyncThunk(
  "image/updateEventImage",
  async ({ eventId, imageUrl }, { rejectWithValue, dispatch }) => {
    try {
      console.log("Updating image for event:", eventId)

      const response = await axiosWithAuth.patch(`/api/v1/foundation_events/${eventId}`, {
        event_id: eventId,
        event: {
          image_url: imageUrl,
        },
      })

      // Force a refresh of the events to ensure we have the latest data
      setTimeout(() => {
        dispatch(fetchEvents())
      }, 500)

      return response.data
    } catch (error) {
      console.error("Error updating image:", error)
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to update event image. Please try again."
      return rejectWithValue(errorMessage)
    }
  },
)

// Async thunk for removing event image
export const removeEventImage = createAsyncThunk(
  "image/removeEventImage",
  async (eventId, { rejectWithValue, dispatch }) => {
    try {
      console.log("Removing image for event:", eventId)

      const response = await axiosWithAuth.patch(`/api/v1/foundation_events/${eventId}`, {
        event_id: eventId,
        event: {
          image_url: null,
        },
      })

      // Force a refresh of the events to ensure we have the latest data
      setTimeout(() => {
        dispatch(fetchEvents())
      }, 500)

      return response.data
    } catch (error) {
      console.error("Error removing image:", error)
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to remove event image. Please try again."
      return rejectWithValue(errorMessage)
    }
  },
)

// Initial state
const initialState = {
  loading: false,
  error: null,
  success: false,
}

const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    resetImageState: (state) => {
      state.loading = false
      state.error = null
      state.success = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateEventImage.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(updateEventImage.fulfilled, (state) => {
        state.loading = false
        state.error = null
        state.success = true
      })
      .addCase(updateEventImage.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
      .addCase(removeEventImage.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(removeEventImage.fulfilled, (state) => {
        state.loading = false
        state.error = null
        state.success = true
      })
      .addCase(removeEventImage.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.success = false
      })
  },
})

export const { resetImageState } = imageSlice.actions

export default imageSlice.reducer
