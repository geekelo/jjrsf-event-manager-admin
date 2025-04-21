import { configureStore } from "@reduxjs/toolkit"
import eventsReducer from "./eventsSlice"
import attendeesReducer from "./attendeesSlice"
import frontDeskReducer from './frontDeskSlice'

export const store = configureStore({
  reducer: {
    events: eventsReducer,
    frontDesk: frontDeskReducer,
    
    attendees: attendeesReducer,
  },
})
