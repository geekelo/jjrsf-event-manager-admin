import { configureStore } from "@reduxjs/toolkit"
import eventsReducer from "./eventsSlice"
import attendeesReducer from "./attendeesSlice"

export const store = configureStore({
  reducer: {
    events: eventsReducer,
    attendees: attendeesReducer,
  },
})
