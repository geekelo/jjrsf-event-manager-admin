import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { axiosWithAuth } from "../config/axios"

// Async thunk for sending reminders to attendees
export const sendReminder = createAsyncThunk("notifications/sendReminder", async (eventId, { rejectWithValue }) => {
  try {
    const response = await axiosWithAuth.post("/api/v1/notify_attendees", {
      event_id: eventId,
    })
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to send reminders to attendees")
  }
})

// Async thunk for sending bulk emails
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
      return rejectWithValue(error.response?.data?.message || "Failed to send bulk email")
    }
  },
)

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    reminderLoading: false,
    reminderError: null,
    reminderSuccess: false,
    bulkEmailLoading: false,
    bulkEmailError: null,
    bulkEmailSuccess: false,
  },
  reducers: {
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
      // Reminder cases
      .addCase(sendReminder.pending, (state) => {
        state.reminderLoading = true
        state.reminderError = null
        state.reminderSuccess = false
      })
      .addCase(sendReminder.fulfilled, (state) => {
        state.reminderLoading = false
        state.reminderSuccess = true
      })
      .addCase(sendReminder.rejected, (state, action) => {
        state.reminderLoading = false
        state.reminderError = action.payload
      })
      // Bulk email cases
      .addCase(sendBulkEmail.pending, (state) => {
        state.bulkEmailLoading = true
        state.bulkEmailError = null
        state.bulkEmailSuccess = false
      })
      .addCase(sendBulkEmail.fulfilled, (state) => {
        state.bulkEmailLoading = false
        state.bulkEmailSuccess = true
      })
      .addCase(sendBulkEmail.rejected, (state, action) => {
        state.bulkEmailLoading = false
        state.bulkEmailError = action.payload
      })
  },
})

export const { resetReminderStatus, resetBulkEmailStatus } = notificationsSlice.actions
export default notificationsSlice.reducer
