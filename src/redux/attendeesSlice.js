import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { axiosWithAuth } from "../config/axios"

// Async thunk for fetching attendees for a specific event
export const fetchEventAttendees = createAsyncThunk(
  "attendees/fetchEventAttendees",
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await axiosWithAuth.get(`/api/v1/event_attendees?event_id=${eventId}`)
      return { data: response.data, eventId }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to fetch attendees. Please check your connection."
      return rejectWithValue(errorMessage)
    }
  },
)

// Initial state
const initialState = {
  attendees: [],
  loading: false,
  error: null,
  metrics: {
    totalRegistered: 0,
    totalAttendedOnline: 0,
    totalAttendedOffline: 0,
    totalAttendedBoth: 0,
    totalDidNotAttend: 0,
  },
  currentEventId: null,
}

const attendeesSlice = createSlice({
  name: "attendees",
  initialState,
  reducers: {
    clearAttendees: (state) => {
      state.attendees = []
      state.metrics = {
        totalRegistered: 0,
        totalAttendedOnline: 0,
        totalAttendedOffline: 0,
        totalAttendedBoth: 0,
        totalDidNotAttend: 0,
      }
      state.currentEventId = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventAttendees.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEventAttendees.fulfilled, (state, action) => {
        state.loading = false

        // Handle case when payload is null or undefined
        if (action.payload.data === null || action.payload.data === undefined) {
          state.attendees = []
        } else {
          // Transform the data to ensure consistent property naming
          state.attendees = action.payload.data.map((attendee) => ({
            ...attendee,
            // Ensure we have camelCase properties for consistency in the app
            // while preserving the original snake_case properties from the API
            id: attendee.id,
            name: attendee.name,
            email: attendee.email,
            phone: attendee.phone,
            gender: attendee.gender,
            isMember: attendee.member,
            preferredAttendance: attendee.preferred_attendance,
            attendedOnline: attendee.attended_online,
            attendedOffline: attendee.attended_offline,
            isFamily: attendee.family,
            familyMembers: attendee.family_members,
            createdAt: attendee.created_at,
            updatedAt: attendee.updated_at,
          }))
        }

        state.currentEventId = action.payload.eventId // Store the current event ID

        // Calculate metrics based on the fetched attendees
        const metrics = {
          totalRegistered: state.attendees.length,
          totalAttendedOnline: 0,
          totalAttendedOffline: 0,
          totalAttendedBoth: 0,
          totalDidNotAttend: 0,
        }

        // Count different attendance types if we have attendees
        if (state.attendees.length > 0) {
          state.attendees.forEach((attendee) => {
            if (
              (attendee.attended_online || attendee.attendedOnline) &&
              (attendee.attended_offline || attendee.attendedOffline)
            ) {
              metrics.totalAttendedBoth++
            } else if (attendee.attended_online || attendee.attendedOnline) {
              metrics.totalAttendedOnline++
            } else if (attendee.attended_offline || attendee.attendedOffline) {
              metrics.totalAttendedOffline++
            } else {
              metrics.totalDidNotAttend++
            }
          })
        }

        state.metrics = metrics
      })
      .addCase(fetchEventAttendees.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearAttendees } = attendeesSlice.actions

export default attendeesSlice.reducer
