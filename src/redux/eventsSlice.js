import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { axiosWithAuth } from "../config/axios"

// Async thunk for fetching all events
export const fetchEvents = createAsyncThunk("events/fetchEvents", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosWithAuth.get("/api/v1/foundation_events")
    return response.data
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Failed to fetch events. Please check your connection."
    return rejectWithValue(errorMessage)
  }
})

// Async thunk for creating a new event
export const createEvent = createAsyncThunk("events/createEvent", async (eventData, { rejectWithValue }) => {
  try {
    const response = await axiosWithAuth.post("/api/v1/foundation_events", { event: eventData })
    return response.data
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.response?.data?.error || "Failed to create event. Please try again."
    return rejectWithValue(errorMessage)
  }
})

// Async thunk for updating an event
export const updateEvent = createAsyncThunk(
  "events/updateEvent",
  async ({ eventId, eventData }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosWithAuth.patch(`/api/v1/foundation_events/${eventId}`, {
        event_id: eventId,
        event: eventData,
      })

      // Force a refresh of the events to ensure we have the latest data
      dispatch(fetchEvents())

      return response.data
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.response?.data?.error || "Failed to update event. Please try again."
      return rejectWithValue(errorMessage)
    }
  },
)

// Update event evaluation
export const updateEventEvaluation = createAsyncThunk(
  "events/updateEventEvaluation",
  async ({ eventId, evaluation }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosWithAuth.patch(`/api/v1/foundation_events/${eventId}`, {
        event_id: eventId,
        event: {
          evaluation,
        },
      })

      // Force refresh of all events to get the latest data
      dispatch(fetchEvents())

      return response.data
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.response?.data?.error || "Failed to update evaluation. Please try again."
      return rejectWithValue(errorMessage)
    }
  },
)

// Delete event evaluation
export const deleteEventEvaluation = createAsyncThunk(
  "events/deleteEventEvaluation",
  async (eventId, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosWithAuth.patch(`/api/v1/foundation_events/${eventId}`, {
        event_id: eventId,
        event: { evaluation: null },
      })

      // Force refresh of all events to get the latest data
      dispatch(fetchEvents())

      return response.data
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.response?.data?.error || "Failed to delete evaluation. Please try again."
      return rejectWithValue(errorMessage)
    }
  },
)

// Add a new thunk for updating event visibility
export const updateEventVisibility = createAsyncThunk(
  "events/updateEventVisibility",
  async ({ eventId, visibility }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosWithAuth.patch(`/api/v1/foundation_events/${eventId}`, {
        event_id: eventId,
        event: {
          visibility,
        },
      })

      // Force refresh of all events to get the latest data
      setTimeout(() => {
        dispatch(fetchEvents())
      }, 500) // Small delay to ensure the API has time to process

      return response.data
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to update event visibility. Please try again."
      return rejectWithValue(errorMessage)
    }
  },
)

// Initial state
const initialState = {
  events: [],
  filteredEvents: [],
  currentEvent: null,
  currentEventId: null,
  loading: false,
  error: null,
  filters: {
    status: "all",
    dateRange: "all",
    sortBy: "date",
  },
  searchTerm: "",
  isEditMode: false,
}

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload
      state.filteredEvents = filterEvents(state.events, state.searchTerm, state.filters)
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
      state.filteredEvents = filterEvents(state.events, state.searchTerm, state.filters)
    },
    resetFilters: (state) => {
      state.filters = {
        status: "all",
        dateRange: "all",
        sortBy: "date",
      }
      state.filteredEvents = filterEvents(state.events, state.searchTerm, state.filters)
    },
    addLocalEvent: (state, action) => {
      state.events.push(action.payload)
      state.filteredEvents = filterEvents(state.events, state.searchTerm, state.filters)
    },
    updateLocalEvent: (state, action) => {
      const index = state.events.findIndex((event) => event.id === action.payload.id)
      if (index !== -1) {
        state.events[index] = { ...state.events[index], ...action.payload }
        state.filteredEvents = filterEvents(state.events, state.searchTerm, state.filters)

        // Also update currentEvent if it matches the updated event
        if (state.currentEvent && state.currentEvent.id === action.payload.id) {
          state.currentEvent = { ...state.currentEvent, ...action.payload }
        }
      }
    },
    setCurrentEvent: (state, action) => {
      const eventId = action.payload
      state.currentEventId = eventId
      state.currentEvent = state.events.find((event) => event.id === eventId) || null
      state.error = state.currentEvent ? null : "Event not found"
    },
    setEditMode: (state, action) => {
      state.isEditMode = action.payload
    },
    resetCurrentEvent: (state) => {
      state.currentEvent = null
      state.currentEventId = null
      state.isEditMode = false
    },
    // Manually update current event in state
    updateCurrentEvent: (state, action) => {
      if (state.currentEvent && state.currentEvent.id === action.payload.id) {
        state.currentEvent = { ...state.currentEvent, ...action.payload }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false
        state.events = action.payload
        state.filteredEvents = filterEvents(action.payload, state.searchTerm, state.filters)

        // Also update currentEvent if it exists
        if (state.currentEvent) {
          const updatedEvent = action.payload.find((event) => event.id === state.currentEvent.id)
          if (updatedEvent) {
            state.currentEvent = updatedEvent
          }
        }
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createEvent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false
        state.events.push(action.payload)
        state.filteredEvents = filterEvents(state.events, state.searchTerm, state.filters)
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateEvent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false
        // Update in events array
        const index = state.events.findIndex((event) => event.id === action.payload.id)
        if (index !== -1) {
          state.events[index] = action.payload
          state.filteredEvents = filterEvents(state.events, state.searchTerm, state.filters)
        }
        // Update current event
        if (state.currentEvent && state.currentEvent.id === action.payload.id) {
          state.currentEvent = action.payload
        }
        state.isEditMode = false
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateEventEvaluation.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateEventEvaluation.fulfilled, (state, action) => {
        state.loading = false
        // Update in events array
        const index = state.events.findIndex((event) => event.id === action.payload.id)
        if (index !== -1) {
          state.events[index] = action.payload
          state.filteredEvents = filterEvents(state.events, state.searchTerm, state.filters)
        }
        // Update current event
        if (state.currentEvent && state.currentEvent.id === action.payload.id) {
          state.currentEvent = action.payload
        }
      })
      .addCase(updateEventEvaluation.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(deleteEventEvaluation.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteEventEvaluation.fulfilled, (state, action) => {
        state.loading = false
        // Update in events array
        const index = state.events.findIndex((event) => event.id === action.payload.id)
        if (index !== -1) {
          state.events[index] = action.payload
          state.filteredEvents = filterEvents(state.events, state.searchTerm, state.filters)
        }
        // Update current event
        if (state.currentEvent && state.currentEvent.id === action.payload.id) {
          state.currentEvent = action.payload
        }
      })
      .addCase(deleteEventEvaluation.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Add cases for updateEventVisibility
      .addCase(updateEventVisibility.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateEventVisibility.fulfilled, (state, action) => {
        state.loading = false
        // Update in events array
        const index = state.events.findIndex((event) => event.id === action.payload.id)
        if (index !== -1) {
          state.events[index] = action.payload
          state.filteredEvents = filterEvents(state.events, state.searchTerm, state.filters)
        }
        // Update current event
        if (state.currentEvent && state.currentEvent.id === action.payload.id) {
          state.currentEvent = action.payload
        }
      })
      .addCase(updateEventVisibility.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

// Helper function to filter and sort events
const filterEvents = (events, searchTerm, filters) => {
  return events
    .filter((event) => {
      // Text search
      const matchesSearch =
        !searchTerm ||
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (event.location && event.location.toLowerCase().includes(searchTerm.toLowerCase()))

      // Status filter
      const matchesStatus = filters.status === "all" || event.status === filters.status

      // Date range filter
      let matchesDate = true
      const today = new Date()
      const eventStartDate = new Date(event.start_date)

      if (filters.dateRange === "upcoming30") {
        const thirtyDaysFromNow = new Date()
        thirtyDaysFromNow.setDate(today.getDate() + 30)
        matchesDate = eventStartDate >= today && eventStartDate <= thirtyDaysFromNow
      } else if (filters.dateRange === "upcoming90") {
        const ninetyDaysFromNow = new Date()
        ninetyDaysFromNow.setDate(today.getDate() + 90)
        matchesDate = eventStartDate >= today && eventStartDate <= ninetyDaysFromNow
      } else if (filters.dateRange === "past") {
        matchesDate = eventStartDate < today
      }

      return matchesSearch && matchesStatus && matchesDate
    })
    .sort((a, b) => {
      if (filters.sortBy === "date") {
        return new Date(a.start_date) - new Date(b.start_date)
      } else if (filters.sortBy === "name") {
        return a.name.localeCompare(b.name)
      } else if (filters.sortBy === "status") {
        return a.status.localeCompare(b.status)
      }
      return 0
    })
}

export const {
  setSearchTerm,
  setFilters,
  resetFilters,
  addLocalEvent,
  updateLocalEvent,
  setCurrentEvent,
  setEditMode,
  resetCurrentEvent,
  updateCurrentEvent,
} = eventsSlice.actions

export default eventsSlice.reducer
