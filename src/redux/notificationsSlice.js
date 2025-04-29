import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { axiosWithAuth } from "../config/axios"
import { toast } from "react-toastify"

// Send reminder to all event attendees
export const sendReminder = createAsyncThunk(
  "notifications/sendEventReminder",
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await axiosWithAuth.post("/api/v1/notify_attendees", {
        event_id: eventId,
      })
      return response.data
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.response?.data?.error || "Failed to send reminders. Please try again."
      return rejectWithValue(errorMessage)
    }
  },
)

// Send bulk email to event attendees
export const sendBulkEmail = createAsyncThunk(
  "notifications/sendBulkEmail",
  async ({ eventId, mode, subject, body }, { rejectWithValue }) => {
    try {
      const response = await axiosWithAuth.post("/api/v1/bulk_email", {
        event_id: eventId,
        mode: mode,
        event_email: {
          subject: subject,
          body: body,
        },
      })
      return response.data
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.response?.data?.error || "Failed to send bulk email. Please try again."
      return rejectWithValue(errorMessage)
    }
  },
)

// Send direct email to individual attendee
export const sendDirectEmail = createAsyncThunk(
  "notifications/sendDirectEmail",
  async ({ eventId, attendeeId, subject, body }, { rejectWithValue }) => {
    try {
      const response = await axiosWithAuth.post("/api/v1/direct_email", {
        event_id: eventId,
        event_attendee_id: attendeeId,
        event_email: {
          subject: subject,
          body: body,
        },
      })
      return response.data
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to send email to attendee. Please try again."
      return rejectWithValue(errorMessage)
    }
  },
)

// Send publicity email to all unique attendees
export const sendPublicityEmail = createAsyncThunk(
  "notifications/sendPublicityEmail",
  async ({ subject, body }, { rejectWithValue }) => {
    try {
      const response = await axiosWithAuth.post("/api/v1/publicity_email", {
        event_email: {
          subject: subject,
          body: body,
        },
      })
      return response.data
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to send publicity email. Please try again."
      return rejectWithValue(errorMessage)
    }
  },
)

// Fetch unique attendees
export const fetchUniqueAttendees = createAsyncThunk(
  "notifications/fetchUniqueAttendees",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosWithAuth.get("/api/v1/unique_attendees")
      return response.data
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.response?.data?.error || "Failed to fetch attendees. Please try again."
      return rejectWithValue(errorMessage)
    }
  },
)

const initialState = {
  loading: false,
  error: null,
  success: false,
  uniqueAttendees: [],
  totalUniqueAttendees: 0,
  loadingUniqueAttendees: false,
  errorUniqueAttendees: null,
}

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    resetNotificationState: (state) => {
      state.loading = false
      state.error = null
      state.success = false
    },
    resetReminderStatus: (state) => {
      state.reminderLoading = false
      state.reminderError = null
      state.reminderSuccess = false
    },
    resetBulkEmailStatus: (state) => {
      state.bulkEmailLoading = false
      state.bulkEmailError = null
      state.bulkEmailSuccess = false
    },
  },
  extraReducers: (builder) => {
    builder
      // Send Event Reminder
      .addCase(sendReminder.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
        state.reminderLoading = true
        state.reminderError = null
        state.reminderSuccess = false
      })
      .addCase(sendReminder.fulfilled, (state) => {
        state.loading = false
        state.success = true
        state.reminderLoading = false
        state.reminderSuccess = true
        toast.success("Reminders sent successfully!")
      })
      .addCase(sendReminder.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.reminderLoading = false
        state.reminderError = action.payload
        toast.error(action.payload || "Failed to send reminders")
      })

      // Send Bulk Email
      .addCase(sendBulkEmail.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
        state.bulkEmailLoading = true
        state.bulkEmailError = null
        state.bulkEmailSuccess = false
      })
      .addCase(sendBulkEmail.fulfilled, (state) => {
        state.loading = false
        state.success = true
        state.bulkEmailLoading = false
        state.bulkEmailSuccess = true
        toast.success("Bulk email sent successfully!")
      })
      .addCase(sendBulkEmail.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.bulkEmailLoading = false
        state.bulkEmailError = action.payload
        toast.error(action.payload || "Failed to send bulk email")
      })

      // Send Direct Email
      .addCase(sendDirectEmail.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(sendDirectEmail.fulfilled, (state) => {
        state.loading = false
        state.success = true
        toast.success("Email sent successfully!")
      })
      .addCase(sendDirectEmail.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        toast.error(action.payload || "Failed to send email")
      })

      // Send Publicity Email
      .addCase(sendPublicityEmail.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(sendPublicityEmail.fulfilled, (state) => {
        state.loading = false
        state.success = true
        toast.success("Publicity email sent successfully!")
      })
      .addCase(sendPublicityEmail.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        toast.error(action.payload || "Failed to send publicity email")
      })

      // Fetch Unique Attendees
      .addCase(fetchUniqueAttendees.pending, (state) => {
        state.loadingUniqueAttendees = true
        state.errorUniqueAttendees = null
      })
      .addCase(fetchUniqueAttendees.fulfilled, (state, action) => {
        state.loadingUniqueAttendees = false
        state.uniqueAttendees = action.payload
        state.totalUniqueAttendees = action.payload.length
      })
      .addCase(fetchUniqueAttendees.rejected, (state, action) => {
        state.loadingUniqueAttendees = false
        state.errorUniqueAttendees = action.payload
      })
  },
})

export const { resetNotificationState, resetReminderStatus, resetBulkEmailStatus } = notificationsSlice.actions

export default notificationsSlice.reducer
