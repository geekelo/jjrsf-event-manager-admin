import { configureStore } from "@reduxjs/toolkit"
import eventsReducer from "./eventsSlice"
import attendeesReducer from "./attendeesSlice"
import quickRegistrationsReducer from "./quickRegistrationsSlice"
import frontDeskReducer from './frontDeskSlice'
import platformReducer from './platformSlice'

export const store = configureStore({
  reducer: {
    events: eventsReducer,
    frontDesk: frontDeskReducer,
  attendees: attendeesReducer,
    platform: platformReducer,
    quickRegistrations: quickRegistrationsReducer,
  },
})