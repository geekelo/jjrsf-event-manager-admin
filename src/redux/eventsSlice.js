import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { axiosWithAuth } from "../config/axios"

// Async thunk for fetching all events
export const fetchEvents = createAsyncThunk("events/fetchEvents", async (_, { rejectWithValue }) => {
  try {
    // Use axiosWithAuth instead of createAxiosInstance
    const response = await axiosWithAuth.get("/api/v1/foundation_events")
    return response.data
  } catch (error) {
    // Improved error handling
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
    // Use axiosWithAuth instead of createAxiosInstance
    const response = await axiosWithAuth.post("/api/v1/foundation_events", { event: eventData })
    return response.data
  } catch (error) {
    // Improved error handling
    const errorMessage =
      error.response?.data?.message || error.response?.data?.error || "Failed to create event. Please try again."
    return rejectWithValue(errorMessage)
  }
})

// Async thunk for updating an event
export const updateEvent = createAsyncThunk(
  "events/updateEvent",
  async ({ eventId, eventData }, { rejectWithValue }) => {
    try {
  

      // Use PATCH and axiosWithAuth with the correct format
      const response = await axiosWithAuth.patch(`/api/v1/foundation_events/${eventId}`, {
        id: eventId,
        event_updates: eventData,
      })

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
  "events/updateEventEvaluation",
  async ({ eventId, evaluation }, { rejectWithValue }) => {
    try {
      // Use PATCH for evaluation update with the correct format
      const response = await axiosWithAuth.patch(`/api/v1/foundation_events/${eventId}`, {
        id: eventId,
        event_updates: { evaluation },
      })
      return response.data
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
  events: [],
  filteredEvents: [],
  currentEvent: null,
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
    // Add a local event (for optimistic updates)
    addLocalEvent: (state, action) => {
      state.events.push(action.payload)
      state.filteredEvents = filterEvents(state.events, state.searchTerm, state.filters)
    },
    // Update a local event (for optimistic updates)
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
    // Set current event by ID
    setCurrentEvent: (state, action) => {
      const eventId = action.payload
      state.currentEvent = state.events.find((event) => event.id === eventId) || null
      state.error = state.currentEvent ? null : "Event not found"
    },
    // Set edit mode
    setEditMode: (state, action) => {
      state.isEditMode = action.payload
    },
    // Reset current event
    resetCurrentEvent: (state) => {
      state.currentEvent = null
      state.isEditMode = false
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false
        state.events = action.payload
        state.filteredEvents = filterEvents(action.payload, state.searchTerm, state.filters)
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Create event
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
      // Update event
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
      // Update event evaluation
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
} = eventsSlice.actions

export default eventsSlice.reducer
