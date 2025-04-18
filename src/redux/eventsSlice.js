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

// Initial state
const initialState = {
  events: [],
  filteredEvents: [],
  loading: false,
  error: null,
  filters: {
    status: "all",
    dateRange: "all",
    sortBy: "date",
  },
  searchTerm: "",
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
      }
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
      .addCase(createEvent.pending, (state) => {e
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
      const eventStartDate = new Date(event.startDate)

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
        return new Date(a.startDate) - new Date(b.startDate)
      } else if (filters.sortBy === "name") {
        return a.name.localeCompare(b.name)
      } else if (filters.sortBy === "status") {
        return a.status.localeCompare(b.status)
      }
      return 0
    })
}

export const { setSearchTerm, setFilters, resetFilters, addLocalEvent, updateLocalEvent } = eventsSlice.actions

export default eventsSlice.reducer
